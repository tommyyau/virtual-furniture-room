import { useFurnitureStore } from '../store';
import type { FurnitureItem } from '../types';

export function useFurnitureSelection() {
  const { selectedItems, addItem, removeItem, clearItems, isSelected } = useFurnitureStore();

  const toggleItem = (item: FurnitureItem) => {
    if (isSelected(item.id)) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  return {
    selectedItems,
    addItem,
    removeItem,
    clearItems,
    toggleItem,
    isSelected,
    itemCount: selectedItems.length,
    totalPrice,
  };
}
