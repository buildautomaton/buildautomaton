import { asLiveHub } from '@plugins/live/types.js';

/** ACP presence on the live bus. The widget treats `acp` as connected to this CLI plugin. */
export function attachAcpLive(extras: Record<string, unknown>): void {
  const live = asLiveHub(extras);
  if (!live) return;
  const hello = { online: true };
  live.welcome((send) => send('acp', hello));
  live.on('acp', (_payload, reply) => reply('acp', hello));
}
