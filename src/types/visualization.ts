import type { FurnitureItem } from './furniture';
import type { RoomType, DesignStyle } from './room';

export type AIProvider = 'openai' | 'gemini' | 'decor8';

export const AI_PROVIDER_INFO: Record<AIProvider, { name: string; cost: string; description: string; recommended?: boolean }> = {
  openai: {
    name: 'OpenAI GPT Image 1.5',
    cost: '~$0.07/image',
    description: 'Recommended - best quality and reliability',
    recommended: true,
  },
  gemini: {
    name: 'Nano Banana Pro (Gemini)',
    cost: '~$0.15/image',
    description: 'Requires paid Gemini plan (not free tier)',
  },
  decor8: {
    name: 'Decor8 AI',
    cost: '~$0.20/image',
    description: 'Purpose-built for furniture visualization',
  },
};

export interface VisualizationResult {
  id: string;
  originalRoomUrl: string;
  generatedImageUrl: string;
  furnitureItems: FurnitureItem[];
  roomType: RoomType;
  designStyle: DesignStyle;
  provider: AIProvider;
  createdAt: string;
}

export interface GenerationRequest {
  roomImageUrl: string;
  furnitureItems: Array<{
    url: string;
    name: string;
  }>;
  roomType: RoomType;
  designStyle: DesignStyle;
  provider: AIProvider;
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  provider?: AIProvider;
}

export type GenerationStatus = 'idle' | 'uploading' | 'generating' | 'complete' | 'error';
