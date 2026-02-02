import type { VercelRequest, VercelResponse } from '@vercel/node';

interface IkeaProduct {
  id: string;
  name: string;
  description?: string;
  articleNumber: string;
  price: number;
  currency: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'inches';
  };
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  ikeaUrl: string;
}

// Simple cache to avoid hitting IKEA too frequently
const cache = new Map<string, { data: IkeaProduct; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { articleNumber, url } = req.query;

  if (!articleNumber && !url) {
    return res.status(400).json({ error: 'Article number or URL is required' });
  }

  const cacheKey = (articleNumber as string) || (url as string);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.status(200).json(cached.data);
  }

  try {
    // For now, return a placeholder response
    // In production, you would scrape the IKEA page here
    // Note: IKEA has anti-scraping measures, so you may need to use
    // their official API if available, or a headless browser

    const mockProduct: IkeaProduct = {
      id: `ikea-${articleNumber || 'unknown'}`,
      name: 'IKEA Product',
      articleNumber: (articleNumber as string) || '00000000',
      price: 0,
      currency: 'USD',
      imageUrl: '',
      thumbnailUrl: '',
      category: 'Unknown',
      ikeaUrl: (url as string) || `https://www.ikea.com/us/en/p/-${articleNumber}/`,
    };

    // Note: Actual scraping implementation would go here
    // This is a placeholder that returns mock data
    // To implement real scraping:
    // 1. Fetch the IKEA product page
    // 2. Parse the HTML to extract product data
    // 3. Handle rate limiting and errors

    return res.status(200).json({
      success: true,
      product: mockProduct,
      note: 'This is mock data. Implement actual scraping for production.',
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({
      error: 'Failed to fetch product data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
