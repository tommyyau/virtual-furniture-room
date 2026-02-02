import { useState, useMemo } from 'react';
import type { FurnitureItem } from '../../types';
import { FurnitureGrid } from './FurnitureGrid';
import './FurnitureSelector.css';

interface FurnitureSelectorProps {
  items: FurnitureItem[];
}

export function FurnitureSelector({ items }: FurnitureSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = new Set(items.map((item) => item.category));
    return ['All', ...Array.from(cats).sort()];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="furniture-selector">
      <div className="furniture-selector-filters">
        <div className="furniture-selector-search">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search furniture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="furniture-selector-search-input"
          />
        </div>
        <div className="furniture-selector-categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <FurnitureGrid items={filteredItems} />
    </div>
  );
}
