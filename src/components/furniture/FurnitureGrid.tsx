import type { FurnitureItem } from '../../types';
import { FurnitureCard } from './FurnitureCard';
import './FurnitureGrid.css';

interface FurnitureGridProps {
  items: FurnitureItem[];
  showAddButton?: boolean;
}

export function FurnitureGrid({ items, showAddButton = true }: FurnitureGridProps) {
  if (items.length === 0) {
    return (
      <div className="furniture-grid-empty">
        <p>No furniture items found</p>
      </div>
    );
  }

  return (
    <div className="furniture-grid">
      {items.map((item) => (
        <FurnitureCard key={item.id} item={item} showAddButton={showAddButton} />
      ))}
    </div>
  );
}
