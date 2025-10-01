import { useCallback } from 'react';

import { ApiResponse } from '@/types';

import { useApiState } from './useApiState';

export function useApiCall<T, P extends unknown[]>(apiFunction: (...args: P) => Promise<ApiResponse<T>>) {
  const { loading, error, data, setLoading, setError, setData, reset } = useApiState<T>();

  const execute = useCallback(
    async (...args: P) => {
      try {
        setLoading(true);
        const result = await apiFunction(...args);
        setData(result.data);
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
