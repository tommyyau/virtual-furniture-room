import { useNavigate } from 'react-router-dom';
import { FurnitureSelector } from '../components/furniture/FurnitureSelector';
import { SelectedItems } from '../components/furniture/SelectedItems';
import { Button } from '../components/ui/Button';
import { useFurnitureStore, useRoomStore } from '../store';
import productsData from '../data/products.json';
import type { FurnitureItem } from '../types';
import './CatalogPage.css';

const products = productsData as FurnitureItem[];

export function CatalogPage() {
  const navigate = useNavigate();
  const roomImage = useRoomStore((state) => state.roomImage);
  const selectedItems = useFurnitureStore((state) => state.selectedItems);

  const handleContinue = () => {
    navigate('/design');
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="catalog-page">
      <div className="catalog-page-header">
        <div>
          <h1 className="catalog-page-title">Select Furniture</h1>
          <p className="catalog-page-subtitle">
            Browse our catalog and select items to add to your room
          </p>
        </div>
        <div className="catalog-page-actions">
          <Button variant="ghost" onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="primary"
            onClick={handleContinue}
            disabled={!roomImage || selectedItems.length === 0}
          >
            Continue ({selectedItems.length})
          </Button>
        </div>
      </div>

      {!roomImage && (
        <div className="catalog-page-warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Please upload a room photo first</span>
          <Button variant="outline" size="sm" onClick={handleBack}>
            Upload Photo
          </Button>
        </div>
      )}

      <div className="catalog-page-content">
        <div className="catalog-page-main">
          <FurnitureSelector items={products} />
        </div>
        <aside className="catalog-page-sidebar">
          <SelectedItems />
        </aside>
      </div>
    </div>
  );
}
