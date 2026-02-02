import { create } from 'zustand';
import type { RoomImage, RoomType, DesignStyle, AIProvider } from '../types';

interface RoomState {
  roomImage: RoomImage | null;
  roomType: RoomType;
  designStyle: DesignStyle;
  aiProvider: AIProvider;
  setRoomImage: (image: RoomImage | null) => void;
  setRoomType: (type: RoomType) => void;
  setDesignStyle: (style: DesignStyle) => void;
  setAIProvider: (provider: AIProvider) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomImage: null,
  roomType: 'livingroom',
  designStyle: 'modern',
  aiProvider: 'openai',
  setRoomImage: (image) => set({ roomImage: image }),
  setRoomType: (type) => set({ roomType: type }),
  setDesignStyle: (style) => set({ designStyle: style }),
  setAIProvider: (provider) => set({ aiProvider: provider }),
  reset: () => set({ roomImage: null, roomType: 'livingroom', designStyle: 'modern', aiProvider: 'openai' }),
}));
