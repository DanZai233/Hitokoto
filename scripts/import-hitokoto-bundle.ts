import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_BUNDLE_URL = 'https://cdn.jsdelivr.net/gh/hitokoto-osc/sentences-bundle@latest/';
const BUNDLE_URL = process.env.HITOKOTO_BUNDLE_URL || DEFAULT_BUNDLE_URL;
const BUNDLE_DIR = process.env.HITOKOTO_BUNDLE_DIR;
const MAX_LENGTH = Number(process.env.HITOKOTO_MAX_LENGTH || 40);
const CORPUS_PATH = path.resolve(process.cwd(), 'src/data/corpus.json');
const CORPUS_MODULE_PATH = path.resolve(process.cwd(), 'src/data/corpus.ts');

interface CorpusQuote {
  text: string;
  author?: string;
  category?: string;
}

interface BundleVersion {
  bundle_version: string;
  updated_at: number;
  sentences: Array<{
    key: string;
    name: string;
    path: string;
  }>;
}

interface HitokotoSentence {
  uuid?: string;
  hitokoto?: string;
  type?: string;
  from?: string | null;
  from_who?: string | null;
  creator?: string | null;
  length?: number;
}

const CATEGORY_MAP: Record<string, string> = {
  a: 'anime',
  b: 'anime',
  c: 'game',
  d: 'literature',
  e: 'internet',
  f: 'internet',
  g: 'internet',
  h: 'movie',
  i: 'literature',
  j: 'music',
  k: 'philosophy',
  l: 'internet',
};

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeText(value: unknown) {
  return clean(value).replace(/\r?\n/g, ' ');
}

function normalizeAuthor(sentence: HitokotoSentence) {
  const from = clean(sentence.from);
  const fromWho = clean(sentence.from_who);
  const creator = clean(sentence.creator);

  if (from && fromWho && from !== fromWho) {
    return `${fromWho} · ${from}`;
  }

  return fromWho || from || creator || '一言';
}

function normalizeSentence(sentence: HitokotoSentence): CorpusQuote | null {
  const text = normalizeText(sentence.hitokoto);
  const sourceCategory = clean(sentence.type);
  const category = CATEGORY_MAP[sourceCategory];
  const length = Number.isFinite(sentence.length)
    ? Number(sentence.length)
    : [...text].length;

  if (!text || !category || length > MAX_LENGTH) {
    return null;
  }

  return {
    text,
    author: normalizeAuthor(sentence),
    category,
  };
}

function jsonFileBody(quotes: CorpusQuote[]) {
  return `[\n${quotes
    .map(
      (quote) =>
        `  { "text": ${JSON.stringify(quote.text)}, "author": ${JSON.stringify(quote.author || '佚名')}, "category": ${JSON.stringify(quote.category)} }`
    )
    .join(',\n')}\n]\n`;
}

function moduleFileBody(quotes: CorpusQuote[]) {
  return `export interface CorpusQuote {\n  text: string;\n  author?: string;\n  category?: string;\n}\n\nexport const corpus = ${JSON.stringify(quotes, null, 2)} satisfies CorpusQuote[];\n`;
}

async function readBundleJson<T>(relativePath: string): Promise<T> {
  const normalizedPath = relativePath.replace(/^\.\//, '');

  if (BUNDLE_DIR) {
    return JSON.parse(await fs.readFile(path.resolve(BUNDLE_DIR, normalizedPath), 'utf8')) as T;
  }

  const url = new URL(normalizedPath, BUNDLE_URL);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

async function writeCorpusFiles(quotes: CorpusQuote[]) {
  await fs.writeFile(CORPUS_PATH, jsonFileBody(quotes));
  await fs.writeFile(CORPUS_MODULE_PATH, moduleFileBody(quotes));
}

async function main() {
  const existing = JSON.parse(await fs.readFile(CORPUS_PATH, 'utf8')) as CorpusQuote[];
  const version = await readBundleJson<BundleVersion>('version.json');
  const imported: CorpusQuote[] = [];
  const importedByCategory: Record<string, number> = {};

  for (const sentenceMeta of version.sentences) {
    const sentences = await readBundleJson<HitokotoSentence[]>(sentenceMeta.path);
    const normalized = sentences
      .map((sentence) => normalizeSentence(sentence))
      .filter((quote): quote is CorpusQuote => Boolean(quote));

    imported.push(...normalized);
    importedByCategory[sentenceMeta.key] = normalized.length;
  }

  const byKey = new Map<string, CorpusQuote>();
  for (const quote of [...existing, ...imported]) {
    byKey.set(`${quote.text}::${quote.author || ''}`, quote);
  }

  const merged = [...byKey.values()];
  await writeCorpusFiles(merged);

  console.log(JSON.stringify({
    ok: true,
    source: BUNDLE_DIR || BUNDLE_URL,
    bundleVersion: version.bundle_version,
    updatedAt: version.updated_at,
    maxLength: MAX_LENGTH,
    existing: existing.length,
    imported: imported.length,
    total: merged.length,
    importedByCategory,
    outputs: [CORPUS_PATH, CORPUS_MODULE_PATH],
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
