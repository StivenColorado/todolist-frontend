import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTodoStore } from '../../stores/StoreProvider';
import { TodoForm } from '../../components/todos/TodoForm';
import { TodoItem } from '../../components/todos/TodoItem';
import { TodoFilters } from '../../components/todos/TodoFilters';
import { TodoStats } from '../../components/todos/TodoStats';
import { SearchBar } from '../../components/todos/SearchBar';
import { TodoDetailsModal } from '../../components/todos/TodoDetailsModal';
import { Plus, X } from 'lucide-react';

const TodoApp = observer(() => {
  const todoStore = useTodoStore();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, todoId: null });

  // Cargar tareas al montar el componente
  useEffect(() => {
    todoStore.fetchTodos();
  }, []);

  // Filtrar tareas por término de búsqueda
  const filteredBySearch = searchTerm
    ? todoStore.todos.filter(todo => 
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : todoStore.todos;

  const showToast = (type, message) => {
    setToast({ type, message, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateTodo = async (todoData) => {
    try {
      await todoStore.createTodo(todoData);
      showToast('success', '¡Tarea creada exitosamente!');
    } catch (error) {
      showToast('error', 'Error al crear la tarea');
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const todo = todoStore.todos.find(t => t.id === id);
      await todoStore.toggleTodoCompleted(id);
      showToast('success', todo.completed ? 'Tarea marcada como pendiente' : '¡Tarea completada!');
    } catch (error) {
      showToast('error', 'Error al actualizar la tarea');
    }
  };

  const handleDeleteClick = (id) => {
    setConfirmDialog({ isOpen: true, todoId: id });
  };

  const handleConfirmDelete = async () => {
    try {
      await todoStore.deleteTodo(confirmDialog.todoId);
      showToast('success', 'Tarea eliminada');
      setConfirmDialog({ isOpen: false, todoId: null });
    } catch (error) {
      showToast('error', 'Error al eliminar la tarea');
    }
  };

  // Crear una copia del array antes de ordenar para evitar mutar el observable directamente
  const filteredTodos = [...(
    filter === 'all'
      ? filteredBySearch
      : filter === 'completed'
        ? filteredBySearch.filter(todo => todo.completed)
        : filteredBySearch.filter(todo => !todo.completed)
  )].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Todo App Moderna</h1>
                <p className="text-gray-600">Gestiona tus tareas con estilo</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Tarea</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <TodoStats stats={todoStore.todosCount} />
        
        {/* Barra de búsqueda */}
        <SearchBar onSearch={setSearchTerm} />
        
        {/* Filtros */}
        <div className="mb-6">
          <TodoFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            counts={{
              total: todoStore.todosCount.total,
              completed: todoStore.todosCount.completed,
              pending: todoStore.todosCount.pending
            }}
          />
        </div>

        <div className="space-y-3">
          {todoStore.todos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay tareas
              </h3>
              <p className="text-gray-500">
                Crea tu primera tarea para comenzar
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Crear mi primera tarea
              </button>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron tareas
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Cambia el filtro para ver más tareas'}
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteClick}
                onViewDetails={(todo) => setSelectedTodo(todo)}
              />
            ))
          )}
        </div>
      </main>

      {/* Formulario de creación deslizable */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-20 ${
        showCreateForm ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Nueva Tarea</h2>
            <button 
              onClick={() => setShowCreateForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <TodoForm 
              onSubmit={async (data) => {
                await handleCreateTodo(data);
                setShowCreateForm(false);
              }} 
              loading={todoStore.loading} 
            />
          </div>
        </div>
      </div>

      {/* Capa oscura cuando el formulario está abierto */}
      {showCreateForm && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-10"
          onClick={() => setShowCreateForm(false)}
        />
      )}

      {/* Modal de detalles de la tarea */}
      <TodoDetailsModal
        todo={selectedTodo}
        isOpen={!!selectedTodo}
        onClose={() => setSelectedTodo(null)}
      />

      {/* Toast Notifications */}
      {toast && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border-l-4 ${
          toast.type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        } transition-all duration-300 transform ${
          toast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
          <p className={`${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {toast.message}
          </p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Eliminar Tarea</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDialog({ isOpen: false, todoId: null })}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TodoApp;