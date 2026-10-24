export type LiveMessage = { type: string; payload?: unknown };

export type LiveReply = (type: string, payload?: unknown) => void;

export type LiveHandler = (payload: unknown, reply: LiveReply) => void;

export type LiveSend = (type: string, payload?: unknown) => void;

export type LiveSession = { id: string; status: string; harness?: string };

export type LiveHub = {
  publish(type: string, payload?: unknown): void;
  on(type: string, handler: LiveHandler): () => void;
  welcome(fn: (send: LiveSend) => void): () => void;
  attach(broadcast: (payload: unknown) => void): () => void;
  receive(payload: unknown): void;
  greet(send: (payload: unknown) => void): void;
};

export function asLiveHub(extras: Record<string, unknown>): LiveHub | undefined {
  const value = extras.live;
  if (!value || typeof value !== 'object' || !('publish' in value)) return undefined;
  return value as LiveHub;
}
