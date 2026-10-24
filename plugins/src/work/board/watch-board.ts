import { acquireLive } from '@plugins/live/ui/shared.js';

export function watchBoard(reload: () => void): () => void {
  const { client, release } = acquireLive();
  const offWork = client.on('work', () => reload());
  const offHello = client.on('hello', () => reload());
  reload();
  return () => {
    offWork();
    offHello();
    release();
  };
}
