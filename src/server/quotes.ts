import { corpus, type CorpusQuote } from '../data/corpus.js';
import type { Quote } from '../types.js';

const LOCAL_CREATED_AT = Date.UTC(2024, 0, 1);

const quotes: Quote[] = (corpus as CorpusQuote[]).map((quote, index) => ({
  id: `local-${index}`,
  text: quote.text,
  author: quote.author || '佚名',
  category: quote.category,
  status: 'approved',
  submitterId: 'system',
  createdAt: LOCAL_CREATED_AT + index * 1000,
}));

function firstValue(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeCategory(categoryParam?: unknown) {
  const category = firstValue(categoryParam);

  if (typeof category !== 'string' || !category || category === 'all') {
    return null;
  }

  return category.trim();
}

function publicQuote(quote: Quote) {
  return {
    id: quote.id,
    text: quote.text,
    author: quote.author || 'Anonymous',
    category: quote.category,
    createdAt: quote.createdAt || Date.now(),
  };
}

export function getRandomQuote(categoryParam?: unknown) {
  const category = normalizeCategory(categoryParam);
  const matches = category
    ? quotes.filter((quote) => quote.category === category)
    : quotes;

  if (matches.length === 0) {
    throw Object.assign(new Error('No quotes found for this category'), {
      statusCode: 404,
    });
  }

  const randomIndex = Math.floor(Math.random() * matches.length);
  return publicQuote(matches[randomIndex]);
}

export function getQuoteCount() {
  return quotes.length;
}
