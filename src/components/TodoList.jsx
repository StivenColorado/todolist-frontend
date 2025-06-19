import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useTodoStore } from '../stores/StoreProvider';

const TodoList = observer(() => {
  const todoStore = useTodoStore();
  const [filter, setFilter] = useState('all');
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  // Cargar todos al montar el componente
  useEffect(() => {
    todoStore.fetchTodos();
  }, [todoStore]);

  // Manejar creación de nuevo todo
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      await todoStore.createTodo(newTodo);
      setNewTodo({ title: '', description: '' });
    } catch (error) {
      console.error('Error creando todo:', error);
    }
  };

  // Manejar toggle de completado
  const handleToggleComplete = async (id) => {
    try {
      await todoStore.toggleTodoCompleted(id);
    } catch (error) {
      console.error('Error actualizando todo:', error);
    }
  };

  // Manejar eliminación
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este todo?')) {
      try {
        await todoStore.deleteTodo(id);
      } catch (error) {
        console.error('Error eliminando todo:', error);
      }
    }
  };

  // Obtener todos filtrados
  const filteredTodos = todoStore.filterTodos(filter);

  return (
    <div className="todo-app">
      <div className="todo-header">
        <h1>Todo List</h1>
        
        {/* Estadísticas */}
        <div className="todo-stats">
          <span>Total: {todoStore.todosCount.total}</span>
          <span>Pendientes: {todoStore.todosCount.pending}</span>
          <span>Completados: {todoStore.todosCount.completed}</span>
        </div>
      </div>

      {/* Formulario para nuevo todo */}
      <form onSubmit={handleCreateTodo} className="todo-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Título del todo..."
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className="todo-input"
            disabled={todoStore.loading}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Descripción (opcional)..."
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            className="todo-textarea"
            disabled={todoStore.loading}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={todoStore.loading || !newTodo.title.trim()}
        >
          {todoStore.loading ? 'Creando...' : 'Agregar Todo'}
        </button>
      </form>

      {/* Filtros */}
      <div className="todo-filters">
        <button 
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-active' : 'btn-secondary'}`}
        >
          Todos ({todoStore.todosCount.total})
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={`btn ${filter === 'pending' ? 'btn-active' : 'btn-secondary'}`}
        >
          Pendientes ({todoStore.todosCount.pending})
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`btn ${filter === 'completed' ? 'btn-active' : 'btn-secondary'}`}
        >
          Completados ({todoStore.todosCount.completed})
        </button>
      </div>

      {/* Manejo de errores */}
      {todoStore.error && (
        <div className="error-message">
          <p>❌ Error: {todoStore.error}</p>
          <button onClick={() => todoStore.clearError()} className="btn btn-sm">
            Cerrar
          </button>
        </div>
      )}

      {/* Loading state */}
      {todoStore.loading && (
        <div className="loading">
          <p>⏳ Cargando...</p>
        </div>
      )}

      {/* Lista de todos */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <p>
              {filter === 'all' 
                ? '📝 No hay todos aún. ¡Crea tu primer todo!' 
                : `No hay todos ${filter === 'completed' ? 'completados' : 'pendientes'}`
              }
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-content">
                <div className="todo-main">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo.id)}
                    className="todo-checkbox"
                  />
                  <div className="todo-text">
                    <h3 className={todo.completed ? 'strikethrough' : ''}>{todo.title}</h3>
                    {todo.description && (
                      <p className="todo-description">{todo.description}</p>
                    )}
                  </div>
                </div>
                <div className="todo-actions">
                  <button
                    onClick={() => handleToggleComplete(todo.id)}
                    className={`btn btn-sm ${todo.completed ? 'btn-warning' : 'btn-success'}`}
                  >
                    {todo.completed ? '↶ Desmarcar' : '✓ Completar'}
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="btn btn-sm btn-danger"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
              <div className="todo-meta">
                <small>
                  Creado: {new Date(todo.created_at).toLocaleDateString()}
                  {todo.updated_at !== todo.created_at && (
                    <> | Actualizado: {new Date(todo.updated_at).toLocaleDateString()}</>
                  )}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default TodoList;