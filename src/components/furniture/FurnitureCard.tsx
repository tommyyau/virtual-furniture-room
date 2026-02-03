import type { FurnitureItem } from '../../types';
import { Button } from '../ui/Button';
import { useFurnitureStore } from '../../store';
import './FurnitureCard.css';

interface FurnitureCardProps {
  item: FurnitureItem;
  showAddButton?: boolean;
}

export function FurnitureCard({ item, showAddButton = true }: FurnitureCardProps) {
  const { addItem, removeItem, isSelected } = useFurnitureStore();
  const selected = isSelected(item.id);

  const handleToggle = () => {
    if (selected) {
      removeItem(item.id);
    } else {
      addItem(item);
    }
  };

  return (
    <div className={`furniture-card ${selected ? 'furniture-card-selected' : ''}`}>
      <div className="furniture-card-image-container">
        <img
          src={item.thumbnailUrl}
          alt={item.name}
          className="furniture-card-image"
          loading="lazy"
        />
        {selected && (
          <div className="furniture-card-selected-badge">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>
      <div className="furniture-card-content">
        <h3 className="furniture-card-name">{item.name}</h3>
        <div className="furniture-card-footer">
          <span className="furniture-card-price">
            ${item.price.toFixed(2)}
          </span>
          {showAddButton && (
            <Button
              variant={selected ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleToggle}
            >
              {selected ? 'Remove' : 'Add'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
