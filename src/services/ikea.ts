import type { FurnitureItem } from '../types';

const API_BASE = '/api/scrape';

export async function fetchIkeaProduct(articleNumber: string): Promise<FurnitureItem | null> {
  try {
    const response = await fetch(`${API_BASE}/ikea?articleNumber=${articleNumber}`);
    if (!response.ok) {
      console.error('Failed to fetch IKEA product:', response.status);
      return null;
    }
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Error fetching IKEA product:', error);
    return null;
  }
}

export async function fetchIkeaProductByUrl(url: string): Promise<FurnitureItem | null> {
  try {
    const response = await fetch(`${API_BASE}/ikea?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      console.error('Failed to fetch IKEA product:', response.status);
      return null;
    }
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Error fetching IKEA product:', error);
    return null;
  }
}
