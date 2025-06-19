import React from 'react';

export const TodoFilters = ({ currentFilter, onFilterChange, counts }) => {
  const filters = [
    { id: 'all', label: 'Todas', count: counts.total },
    { id: 'pending', label: 'Pendientes', count: counts.pending },
    { id: 'completed', label: 'Completadas', count: counts.completed }
  ];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentFilter === filter.id
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {filter.label} ({filter.count})
        </button>
      ))}
    </div>
  );
};
