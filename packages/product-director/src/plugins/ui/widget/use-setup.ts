import { useEffect, useState } from 'react';
import type { DirectorSetup } from '../../runtime/work/http/setup-status.js';
import { loadSetup } from './load-setup.js';

export function useSetup() {
  const [setup, setSetup] = useState<DirectorSetup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reload = async () => {
    try {
      setSetup(await loadSetup());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read director setup');
    }
  };
  useEffect(() => {
    void reload();
  }, []);
  return { setup, error, reload };
}
