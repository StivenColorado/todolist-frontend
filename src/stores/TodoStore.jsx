import { makeAutoObservable, runInAction } from 'mobx';

class TodoStore {
  todos = [];
  currentTodo = null;
  loading = false;
  error = null;
  
  // Instancia del cliente API (no observable)
  apiClient;

  constructor(apiClient) {
    makeAutoObservable(this, {
      // Marcar apiClient como no observable
      apiClient: false
    });
    
    // Asignar apiClient antes de hacer el makeAutoObservable
    this.apiClient = apiClient;
  }

  // Estados computados
  get completedTodos() {
    return this.todos.filter(todo => todo.completed);
  }

  get pendingTodos() {
    return this.todos.filter(todo => !todo.completed);
  }

  get todosCount() {
    return {
      total: this.todos.length,
      completed: this.completedTodos.length,
      pending: this.pendingTodos.length,
    };
  }

  // CRUD Operations
  
  // Obtener todos los todos
  async fetchTodos() {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });
      
      const todos = await this.apiClient.get('/todos');
      
      runInAction(() => {
        this.todos = todos;
        this.loading = false;
      });
      
      return todos;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      throw error;
    }
  }

  // Crear un nuevo todo
  async createTodo(todoData) {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });

      const newTodo = await this.apiClient.post('/todos', todoData);
      
      runInAction(() => {
        this.todos = [...this.todos, newTodo];
        this.loading = false;
      });
      
      return newTodo;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      throw error;
    }
  }

  // Obtener un todo específico
  async fetchTodo(id) {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });
      
      const todo = await this.apiClient.get(`/todos/${id}`);
      
      runInAction(() => {
        this.currentTodo = todo;
        // Actualizar en la lista si existe
        const index = this.todos.findIndex(t => t.id === todo.id);
        if (index !== -1) {
          this.todos[index] = todo;
        }
        this.loading = false;
      });
      
      return todo;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      throw error;
    }
  }

  // Actualizar un todo (PUT - completo)
  async updateTodo(id, updates) {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });

      const updatedTodo = await this.apiClient.put(`/todos/${id}`, updates);
      
      runInAction(() => {
        this.todos = this.todos.map(todo => 
          todo.id === id ? { ...todo, ...updatedTodo } : todo
        );
        if (this.currentTodo && this.currentTodo.id === id) {
          this.currentTodo = { ...this.currentTodo, ...updatedTodo };
        }
        this.loading = false;
      });
      
      return updatedTodo;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      throw error;
    }
  }

  // Actualizar parcialmente un todo (PATCH)
  async patchTodo(id, partialData) {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });
      
      const updatedTodo = await this.apiClient.patch(`/todos/${id}`, partialData);
      
      runInAction(() => {
        this.todos = this.todos.map(todo => 
          todo.id === id ? { ...todo, ...updatedTodo } : todo
        );
        if (this.currentTodo && this.currentTodo.id === id) {
          this.currentTodo = { ...this.currentTodo, ...updatedTodo };
        }
        this.loading = false;
      });
      
      return updatedTodo;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      throw error;
    }
  }

  // Alternar estado completado
  async toggleTodoCompleted(id) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;

    return this.patchTodo(id, { completed: !todo.completed });
  }

  // Eliminar un todo
  async deleteTodo(id) {
    try {
      runInAction(() => {
        this.loading = true;
        this.error = null;
      });
      
      await this.apiClient.delete(`/todos/${id}`);
      
      runInAction(() => {
        this.todos = this.todos.filter(todo => todo.id !== id);
        if (this.currentTodo && this.currentTodo.id === id) {
          this.currentTodo = null;
        }
        this.loading = false;
      });
      
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      throw error;
    }
  }

  // Limpiar todo seleccionado
  clearCurrentTodo() {
    runInAction(() => {
      this.currentTodo = null;
    });
  }

  // Buscar todo por ID en la lista local
  findTodoById(id) {
    return this.todos.find(todo => todo.id === parseInt(id));
  }

  // Filtrar todos
  filterTodos(filter) {
    switch (filter) {
      case 'completed':
        return this.completedTodos;
      case 'pending':
        return this.pendingTodos;
      default:
        return this.todos;
    }
  }
}

export default TodoStore;