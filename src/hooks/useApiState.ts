import { useState, useCallback } from 'react';
import { LoadingState } from '../types';

export interface ApiState<T> extends LoadingState {
  data: T | null;
}

export function useApiState<T>(initialData: T | null = null) {
  const [state, setState] = useState<ApiState<T>>({
    loading: false,
    error: null,
    data: initialData,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const setData = useCallback((data: T) => {
    setState({ loading: false, error: null, data });
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset,
  };
}
