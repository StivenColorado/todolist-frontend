import React, { createContext, useContext, useMemo } from 'react';
import TodoStore from './TodoStore';
import { ApiClient } from '../hooks/apiClient';

// Contexto para los stores
const StoreContext = createContext();

// Provider de stores
export const StoreProvider = ({ children }) => {
  console.log(`StoreProvider`)
  const apiClient = ApiClient();

  const stores = useMemo(()=>{

    return {
      todoStore: new TodoStore(apiClient),
      apiClient,
    }
  },[])

 

  return (
    <StoreContext.Provider value={stores}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook para usar los stores
export const useStores = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores debe ser usado dentro de StoreProvider');
  }
  return context;
};

// Hooks específicos para cada store
export const useTodoStore = () => {
  const { todoStore } = useStores();
  return todoStore;
};

export const useApiClient = () => {
  const { apiClient } = useStores();
  return apiClient;
};