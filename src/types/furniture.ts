export interface FurnitureItem {
  id: string;
  name: string;
  description?: string;
  articleNumber: string;
  price: number;
  currency: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'inches';
  };
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
}
