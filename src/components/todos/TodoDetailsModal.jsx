import React from 'react';
import { X, Calendar as CalendarIcon, Clock, Tag, CheckCircle, Circle } from 'lucide-react';

export const TodoDetailsModal = ({ todo, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Detalles de la tarea
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center mb-4">
                {todo.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 mr-2" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">{todo.title}</h2>
              </div>
              
              {todo.description && (
                <div className="mb-4">
                  <p className="text-gray-700 whitespace-pre-line">{todo.description}</p>
                </div>
              )}
              
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                  <span>Fecha de creación: {new Date(todo.created_at).toLocaleDateString()}</span>
                </div>
                
                {todo.updated_at !== todo.created_at && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Última actualización: {new Date(todo.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Tag className={`h-4 w-4 mr-2 ${todo.completed ? 'text-green-500' : 'text-yellow-500'}`} />
                  <span>Estado: {todo.completed ? 'Completada' : 'Pendiente'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
