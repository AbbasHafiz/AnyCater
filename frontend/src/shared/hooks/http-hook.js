import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const clearError = useCallback(() => setError(null), []);

  const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setIsLoading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequests.current.push(httpAbortCtrl);
  
    try {
      const response = await fetch(url, { method, body, headers, signal: httpAbortCtrl.signal });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      return responseData;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setError]);

  useEffect(() => {
    const abortControllers = activeHttpRequests.current;

    return () => {
      abortControllers.forEach((abortCtrl) => abortCtrl.abort());
      clearError();
    };
  }, [clearError]);

  return { isLoading, error, sendRequest, clearError };
};
