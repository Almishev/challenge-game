import React from 'react';
import './CategorySelector.css';

const CategorySelector = ({ categories, onSelect }) => {
  const categoryIcons = {
    'Фитнес': '💪',
    'Творчество': '🎨',
    'Образование': '📚',
    'Домашни задачи': '🏠',
    'Музика': '🎵',
    'Природа': '🌿',
    'Готвене': '👨‍🍳',
    'Игри': '🎮',
    'Четене': '📖',
    'Технологии': '💻',
    'Социални': '👥',
    'Медитация': '🧘‍♀️'
  };

  return (
    <div className="category-selector">
      <h2>Избери категория:</h2>
      <div className="categories-grid">
        {categories.map((category) => (
          <button
            key={category}
            className="category-card"
            onClick={() => onSelect(category)}
          >
            <div className="category-icon">
              {categoryIcons[category] || '🎯'}
            </div>
            <h3>{category}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
