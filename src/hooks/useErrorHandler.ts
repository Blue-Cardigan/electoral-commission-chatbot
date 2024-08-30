import { useState, useCallback } from 'react';

export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((message: string) => {
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
}