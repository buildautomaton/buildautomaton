import { parseLiveMessage } from './parse.js';
import type { LiveHandler, LiveHub, LiveSend } from './types.js';

export function createLiveHub(): LiveHub {
  const handlers = new Map<string, Set<LiveHandler>>();
  const welcomes = new Set<(send: LiveSend) => void>();
  const broadcasts = new Set<(payload: unknown) => void>();

  function emit(type: string, payload?: unknown): void {
    const message = { type, payload };
    for (const broadcast of broadcasts) broadcast(message);
  }

  return {
    publish: emit,
    on(type, handler) {
      const set = handlers.get(type) ?? new Set<LiveHandler>();
      set.add(handler);
      handlers.set(type, set);
      return () => set.delete(handler);
    },
    welcome(fn) {
      welcomes.add(fn);
      return () => welcomes.delete(fn);
    },
    attach(broadcast) {
      broadcasts.add(broadcast);
      return () => broadcasts.delete(broadcast);
    },
    receive(payload) {
      const message = parseLiveMessage(payload);
      if (!message) return;
      const reply: LiveSend = emit;
      for (const handler of handlers.get(message.type) ?? []) handler(message.payload, reply);
    },
    greet(send) {
      send({ type: 'hello', payload: { service: 'live' } });
      const typed: LiveSend = (type, payload) => send({ type, payload });
      for (const welcome of welcomes) welcome(typed);
    },
  };
}
