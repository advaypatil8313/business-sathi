import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';

export function useBusiness() {
  const [business, setBusiness] = useState(undefined); // undefined = loading, null = none
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getBusiness();
      setBusiness(data);
    } catch (err) {
      setError(err.message);
      setBusiness(null);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { business, loading: business === undefined, error, refresh, setBusiness };
}
