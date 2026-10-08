import { parseLiveMessage } from '../parse.js';
import { liveUrl } from './url.js';

export type LiveClient = {
  send(type: string, payload?: unknown): void;
  on(type: string, fn: (payload: unknown) => void): () => void;
  close(): void;
};

export function connectLive(
  opts: { url?: string; onOpen?: () => void; onClose?: () => void } = {},
): LiveClient {
  const listeners = new Map<string, Set<(payload: unknown) => void>>();
  let socket: WebSocket | undefined;
  let closed = false;
  let timer = 0;
  const url = opts.url ?? liveUrl();

  function open(): void {
    if (closed) return;
    const ws = new WebSocket(url);
    socket = ws;
    ws.onopen = () => opts.onOpen?.();
    ws.onclose = () => {
      opts.onClose?.();
      if (!closed) timer = window.setTimeout(open, 2000);
    };
    ws.onerror = () => ws.close();
    ws.onmessage = (event) => {
      const message = parseLiveMessage(typeof event.data === 'string' ? event.data : null);
      if (!message) return;
      for (const fn of listeners.get(message.type) ?? []) fn(message.payload);
    };
  }

  open();
  return {
    send(type, payload) {
      if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type, payload }));
    },
    on(type, fn) {
      const set = listeners.get(type) ?? new Set<(payload: unknown) => void>();
      set.add(fn);
      listeners.set(type, set);
      return () => set.delete(fn);
    },
    close() {
      closed = true;
      window.clearTimeout(timer);
      socket?.close();
    },
  };
}
