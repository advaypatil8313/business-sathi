import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

export function useOllamaStatus() {
  const [status, setStatus] = useState(null); // null = checking

  useEffect(() => {
    let cancelled = false;
    api.getOllamaHealth()
      .then((data) => { if (!cancelled) setStatus(data); })
      .catch(() => { if (!cancelled) setStatus({ ok: false, reason: 'Could not reach the Business Sathi server.' }); });
    return () => { cancelled = true; };
  }, []);

  const ready = Boolean(status?.ok && status?.hasModel);
  return { status, ready, checking: status === null };
}
