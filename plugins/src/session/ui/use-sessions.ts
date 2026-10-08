import { useEffect, useState } from 'react';
import { listDiskSessions, newestFirst, type DiskSession } from './client.js';

export function useDiskSessions(active: boolean) {
  const [sessions, setSessions] = useState<DiskSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!active) return;
    let stop = false;
    async function load() {
      try {
        const rows = newestFirst(await listDiskSessions());
        if (stop) return;
        setSessions(rows);
        setError(null);
      } catch (err) {
        if (!stop) setError(err instanceof Error ? err.message : 'Could not list sessions');
      }
    }
    void load();
    const id = setInterval(() => void load(), 1000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, [active]);
  return { sessions, error };
}
