import { useEffect, useState } from 'react';
import { getDiskSession, type DiskSessionSnapshot } from './client.js';

export function useDiskSnapshot(id: string) {
  const [snapshot, setSnapshot] = useState<DiskSessionSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let stop = false;
    async function load() {
      try {
        const next = await getDiskSession(id);
        if (stop) return;
        setSnapshot(next);
        setError(null);
      } catch (err) {
        if (!stop) setError(err instanceof Error ? err.message : 'Could not read session');
      }
    }
    void load();
    const timer = setInterval(() => void load(), 1000);
    return () => {
      stop = true;
      clearInterval(timer);
    };
  }, [id]);
  return { snapshot, error };
}
