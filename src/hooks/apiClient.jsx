import { useState, useCallback } from 'react';

// Configuración base de la API
const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000/api',
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Hook principal del cliente API
export const ApiClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (endpoint, options = {}) => {
    const {
      method = 'GET',
      body = null,
      headers = {},
    } = options;

    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        headers: {
          ...API_CONFIG.HEADERS,
          ...headers,
        },
      };

      // Solo agregar body si no es GET
      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      console.log(`🚀 API Call: ${method} ${url}`, body ? { body } : '');

      const response = await fetch(url, config);
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.error || errorData.message || `Error ${response.status}`);
      }

      // Para DELETE que retorna solo mensaje de éxito
      if (method === 'DELETE') {
        const result = await response.json();
        return result;
      }

      const data = await response.json();
      console.log('✅ API Response:', data);
      return data;

    } catch (err) {
      console.error('❌ API Error:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Métodos específicos para cada tipo de petición
  const get = useCallback((endpoint, headers = {}) => {
    return apiCall(endpoint, { method: 'GET', headers });
  }, [apiCall]);

  const post = useCallback((endpoint, body, headers = {}) => {
    return apiCall(endpoint, { method: 'POST', body, headers });
  }, [apiCall]);

  const put = useCallback((endpoint, body, headers = {}) => {
    return apiCall(endpoint, { method: 'PUT', body, headers });
  }, [apiCall]);

  const patch = useCallback((endpoint, body, headers = {}) => {
    return apiCall(endpoint, { method: 'PATCH', body, headers });
  }, [apiCall]);

  const del = useCallback((endpoint, headers = {}) => {
    return apiCall(endpoint, { method: 'DELETE', headers });
  }, [apiCall]);

  return {
    // Estados
    loading,
    error,
    
    // Métodos
    apiCall,
    get,
    post,
    put,
    patch,
    delete: del,
    
    // Utilidades
    clearError: () => setError(null),
  };
};