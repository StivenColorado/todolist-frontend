import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export const TodoForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    try {
      await onSubmit(formData);
      setFormData({ title: '', description: '' });
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Ej: Comprar víveres"
            disabled={loading}
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Ej: Leche, huevos, pan..."
            disabled={loading}
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={!formData.title.trim() || loading}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 ${
              !formData.title.trim() || loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Agregar Tarea
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};