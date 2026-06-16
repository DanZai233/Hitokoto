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
    const quote = getRandomQuote(req.query?.category);
    res.status(200).json(quote);
  } catch (error) {
    sendError(res, error);
  }
}
