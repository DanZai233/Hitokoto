import fs from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0316053254';
const DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || 'ai-studio-9fc55d78-e9bf-4f21-8b10-2101255971e3';
const CORPUS_PATH = path.resolve(process.cwd(), 'src/data/corpus.json');
const CORPUS_MODULE_PATH = path.resolve(process.cwd(), 'src/data/corpus.ts');

interface CorpusQuote {
  text: string;
  author?: string;
  category?: string;
}

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
}

type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { timestampValue: string }
  | { stringValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

function decodeValue(value: FirestoreValue): unknown {
  if ('nullValue' in value) return null;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('stringValue' in value) return value.stringValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);

  return Object.fromEntries(
    Object.entries(value.mapValue.fields || {}).map(([key, nestedValue]) => [
      key,
      decodeValue(nestedValue),
    ])
  );
}

function decodeFields(fields: FirestoreDocument['fields'] = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, decodeValue(value)])
  ) as Record<string, any>;
}

function normalizeQuote(data: Record<string, any>): CorpusQuote | null {
  const text = typeof data.text === 'string' ? data.text.trim() : '';

  if (!text || data.status === 'rejected' || data.status === 'pending') {
    return null;
  }

  return {
    text,
    author: typeof data.author === 'string' && data.author.trim() ? data.author.trim() : '佚名',
    category: typeof data.category === 'string' && data.category.trim() ? data.category.trim() : undefined,
  };
}

async function writeCorpusFiles(quotes: CorpusQuote[]) {
  await fs.writeFile(CORPUS_PATH, `${JSON.stringify(quotes, null, 2)}\n`);
  await fs.writeFile(
    CORPUS_MODULE_PATH,
    `export interface CorpusQuote {\n  text: string;\n  author?: string;\n  category?: string;\n}\n\nexport const corpus = ${JSON.stringify(quotes, null, 2)} satisfies CorpusQuote[];\n`
  );
}

async function fetchFirestoreQuotes() {
  const token = process.env.GOOGLE_OAUTH_TOKEN;

  if (!token) {
    throw new Error('GOOGLE_OAUTH_TOKEN is required. Run: export GOOGLE_OAUTH_TOKEN="$(gcloud auth print-access-token)"');
  }

  const documents: FirestoreDocument[] = [];
  let pageToken = '';

  do {
    const params = new URLSearchParams({ pageSize: '300' });
    if (pageToken) params.set('pageToken', pageToken);

    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${encodeURIComponent(DATABASE_ID)}/documents/quotes?${params}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Firestore read failed: ${response.status} ${await response.text()}`);
    }

    const payload = await response.json() as {
      documents?: FirestoreDocument[];
      nextPageToken?: string;
    };

    documents.push(...(payload.documents || []));
    pageToken = payload.nextPageToken || '';
  } while (pageToken);

  return documents
    .map((document) => normalizeQuote(decodeFields(document.fields)))
    .filter((quote): quote is CorpusQuote => Boolean(quote));
}

async function main() {
  const existing = JSON.parse(await fs.readFile(CORPUS_PATH, 'utf8')) as CorpusQuote[];
  const imported = await fetchFirestoreQuotes();
  const byKey = new Map<string, CorpusQuote>();

  for (const quote of [...existing, ...imported]) {
    byKey.set(`${quote.text}::${quote.author || ''}`, quote);
  }

  const merged = [...byKey.values()];
  await writeCorpusFiles(merged);

  console.log(JSON.stringify({
    ok: true,
    existing: existing.length,
    imported: imported.length,
    total: merged.length,
    outputs: [CORPUS_PATH, CORPUS_MODULE_PATH],
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
