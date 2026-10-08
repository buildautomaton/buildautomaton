import { useEffect, useState } from 'react';
import type { BuildAutomatonSetup } from '../queue/http/setup-status.js';
import { loadSetup } from './load-setup.js';

export function useSetup() {
  const [setup, setSetup] = useState<BuildAutomatonSetup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reload = async () => {
    try {
      setSetup(await loadSetup());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read buildautomaton setup');
    }
  };
  useEffect(() => {
    void reload();
  }, []);
  return { setup, error, reload };
}
