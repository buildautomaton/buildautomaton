import { useCallback, useEffect, useState } from 'react';
import type { BuildAutomatonSetup } from '../queue/http/setup-status.js';
import { loadSetup, peekSetup } from './load-setup.js';

export function useSetup() {
  const [setup, setSetup] = useState<BuildAutomatonSetup | null>(peekSetup);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(async () => {
    try {
      setError(null);
      setSetup(await loadSetup(true));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read buildautomaton setup');
    }
  }, []);
  useEffect(() => {
    if (!setup?.agents.some((agent) => agent.modelsPending)) return;
    const id = window.setInterval(() => {
      void reload();
    }, 1500);
    return () => window.clearInterval(id);
  }, [setup, reload]);
  useEffect(() => {
    let stop = false;
    loadSetup(false)
      .then((next) => {
        if (!stop) setSetup(next);
      })
      .catch((err: unknown) => {
        if (!stop) setError(err instanceof Error ? err.message : 'Could not read buildautomaton setup');
      });
    return () => {
      stop = true;
    };
  }, []);
  return { setup, error, checking: setup == null && error == null, reload };
}
