import { useCallback } from 'react';

import { ApiState, useApiState } from './useApiState';

export function useApiCall<T, P extends any[]>(apiFunction: (...args: P) => Promise<T>) {
  const { loading, error, data, setLoading, setError, setData, reset } = useApiState<T>();

  const execute = useCallback(
    async (...args: P) => {
      try {
        setLoading(true);
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        throw err;
      }
    },
    [apiFunction, setLoading, setError, setData],
  );

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
}
