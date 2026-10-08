import { connectLive, type LiveClient } from './client.js';

let shared: LiveClient | null = null;
let refs = 0;
let releaseTimer = 0;

/** One socket for the page. Delayed release survives React Strict Mode remounts. */
export function acquireLive(): { client: LiveClient; release: () => void } {
  window.clearTimeout(releaseTimer);
  shared ??= connectLive();
  refs += 1;
  return {
    client: shared,
    release() {
      refs -= 1;
      if (refs > 0) return;
      releaseTimer = window.setTimeout(() => {
        if (refs > 0) return;
        shared?.close();
        shared = null;
      }, 50);
    },
  };
}
