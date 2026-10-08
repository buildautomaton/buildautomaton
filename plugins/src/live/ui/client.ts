import { parseLiveMessage } from '../parse.js';
import { createReconnect, onVisible } from './reconnect.js';
import { safeCloseWs } from './safe-close.js';
import { liveUrl } from './url.js';

const HANDSHAKE_MS = 8_000;

export type LiveClient = {
  send(type: string, payload?: unknown): void;
  on(type: string, fn: (payload: unknown) => void): () => void;
  subscribeOpen(fn: () => void): () => void;
  subscribeClose(fn: () => void): () => void;
  close(): void;
};

export function connectLive(
  opts: { url?: string; onOpen?: () => void; onClose?: () => void } = {},
): LiveClient {
  const listeners = new Map<string, Set<(payload: unknown) => void>>();
  const opens = new Set<() => void>();
  const closes = new Set<() => void>();
  const url = opts.url ?? liveUrl();
  let socket: WebSocket | undefined;
  let stopped = false;
  let handshake = 0;
  const reconnect = createReconnect(open, () => stopped);
  const offVisible = onVisible(() => {
    if (stopped || socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
    reconnect.clear();
    reconnect.reset();
    open();
  });

  function open(): void {
    if (stopped || socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
    const ws = new WebSocket(url);
    socket = ws;
    handshake = window.setTimeout(() => safeCloseWs(ws), HANDSHAKE_MS);
    ws.onopen = () => {
      window.clearTimeout(handshake);
      reconnect.reset();
      opts.onOpen?.();
      for (const fn of opens) fn();
    };
    ws.onerror = () => undefined;
    ws.onclose = () => {
      window.clearTimeout(handshake);
      if (socket === ws) socket = undefined;
      opts.onClose?.();
      for (const fn of closes) fn();
      reconnect.arm();
    };
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
    subscribeOpen(fn) {
      opens.add(fn);
      return () => opens.delete(fn);
    },
    subscribeClose(fn) {
      closes.add(fn);
      return () => closes.delete(fn);
    },
    close() {
      stopped = true;
      reconnect.clear();
      window.clearTimeout(handshake);
      offVisible();
      safeCloseWs(socket);
      socket = undefined;
    },
  };
}
