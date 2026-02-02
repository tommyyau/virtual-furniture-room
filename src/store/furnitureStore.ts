import { create } from 'zustand';
import type { FurnitureItem } from '../types';

interface FurnitureState {
  selectedItems: FurnitureItem[];
  addItem: (item: FurnitureItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  isSelected: (id: string) => boolean;
}

export const useFurnitureStore = create<FurnitureState>((set, get) => ({
  selectedItems: [],
  addItem: (item) =>
    set((state) => {
      if (state.selectedItems.some((i) => i.id === item.id)) {
        return state;
      }
      return { selectedItems: [...state.selectedItems, item] };
    }),
  removeItem: (id) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((i) => i.id !== id),
    })),
  clearItems: () => set({ selectedItems: [] }),
  isSelected: (id) => get().selectedItems.some((i) => i.id === id),
}));
