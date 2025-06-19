import React, { useState } from 'react';
import { Check, Calendar, Edit3, Trash2, ChevronRight } from 'lucide-react';

export const TodoItem = ({ todo, onToggleComplete, onDelete, onViewDetails }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const toggleDescription = (e) => {
    e.stopPropagation();
    setShowFullDescription(!showFullDescription);
  };
  
  const handleToggleComplete = (e) => {
    e.stopPropagation();
    onToggleComplete(todo.id);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(todo.id);
  };
  
  const handleContainerClick = (e) => {
    // Solo abrir el modal si el clic no fue en un botón o enlace
    if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.tagName === 'A' || e.target.closest('a')) {
      return;
    }
    onViewDetails(todo);
  };
  
  const descriptionPreview = todo.description?.length > 50 
    ? `${todo.description.substring(0, 50)}...` 
    : todo.description;
  return (
    <div 
      className={`group bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md cursor-pointer ${
        todo.completed ? 'opacity-75' : ''
      }`}
      onClick={handleContainerClick}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            todo.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${
            todo.completed 
              ? 'line-through text-gray-500' 
              : 'text-gray-800'
          }`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <div className="mt-1">
              <p className={`text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {showFullDescription ? todo.description : descriptionPreview}
                {todo.description.length > 50 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDescription(e);
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700 text-xs font-medium focus:outline-none"
                  >
                    {showFullDescription ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(todo.created_at).toLocaleDateString()}
            </div>
            {todo.updated_at !== todo.created_at && (
              <div className="flex items-center gap-1">
                <Edit3 className="w-3 h-3" />
                {new Date(todo.updated_at).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};