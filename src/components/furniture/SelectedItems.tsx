import { useFurnitureStore } from '../../store';
import { Button } from '../ui/Button';
import './SelectedItems.css';

interface SelectedItemsProps {
  showClearAll?: boolean;
}

export function SelectedItems({ showClearAll = true }: SelectedItemsProps) {
  const { selectedItems, removeItem, clearItems } = useFurnitureStore();

  if (selectedItems.length === 0) {
    return (
      <div className="selected-items-empty">
        <p>No furniture selected yet</p>
        <p className="selected-items-hint">Browse the catalog to add items</p>
      </div>
    );
  }

  return (
    <div className="selected-items">
      <div className="selected-items-header">
        <h3 className="selected-items-title">
          Selected ({selectedItems.length})
        </h3>
        {showClearAll && (
          <Button variant="ghost" size="sm" onClick={clearItems}>
            Clear all
          </Button>
        )}
      </div>
      <div className="selected-items-list">
        {selectedItems.map((item) => (
          <div key={item.id} className="selected-item">
            <img
              src={item.thumbnailUrl}
              alt={item.name}
              className="selected-item-image"
            />
            <div className="selected-item-info">
              <span className="selected-item-name">{item.name}</span>
              <span className="selected-item-price">${item.price.toFixed(2)}</span>
            </div>
            <button
              className="selected-item-remove"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name}`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
