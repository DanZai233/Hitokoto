import { getRandomQuote } from '../src/server/quotes.js';

function setCorsHeaders(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
}

function sendError(res: any, error: unknown) {
  const statusCode =
    typeof error === 'object' && error !== null && 'statusCode' in error
      ? Number((error as { statusCode?: number }).statusCode) || 500
      : 500;

  res.status(statusCode).json({
    error: error instanceof Error ? error.message : 'Internal server error',
  });
}

function getCategoryParam(req: any) {
  const url = new URL(typeof req.url === 'string' ? req.url : '/api/random', 'http://localhost');
  const categories = url.searchParams.getAll('category');

  if (categories.length === 0) {
    return undefined;
  }

  return categories.length === 1 ? categories[0] : categories;
}

export default async function handler(req: any, res: any) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const quote = getRandomQuote(getCategoryParam(req));
    res.status(200).json(quote);
  } catch (error) {
    sendError(res, error);
  }
}
