import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { LiveSession } from '../types.js';
import { acquireLive } from './shared.js';

export type LiveState = { connected: boolean; sessions: LiveSession[] };

const LiveContext = createContext<LiveState | null>(null);

export function LiveProvider({ children }: { children: ReactNode }) {
  const parent = useContext(LiveContext);
  if (parent) return children;
  return <LiveSocket>{children}</LiveSocket>;
}

function LiveSocket({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  useEffect(() => {
    const { client, release } = acquireLive();
    const offAcp = client.on('acp', () => setConnected(true));
    const offClose = client.subscribeClose(() => setConnected(false));
    const offSessions = client.on('sessions', (payload) => {
      const next = (payload as { sessions?: LiveSession[] } | null)?.sessions;
      if (Array.isArray(next)) setSessions(next);
    });
    return () => {
      offAcp();
      offClose();
      offSessions();
      setConnected(false);
      release();
    };
  }, []);
  return <LiveContext.Provider value={{ connected, sessions }}>{children}</LiveContext.Provider>;
}

export function useLive(): LiveState {
  return useContext(LiveContext) ?? { connected: false, sessions: [] };
}
