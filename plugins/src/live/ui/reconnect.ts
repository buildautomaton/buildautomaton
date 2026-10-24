const MIN_MS = 1000;
const MAX_MS = 8000;

export function createReconnect(open: () => void, isStopped: () => boolean): {
  arm: () => void;
  clear: () => void;
  reset: () => void;
} {
  let timer = 0;
  let delay = MIN_MS;
  return {
    arm() {
      if (isStopped() || timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        if (!isStopped()) open();
      }, delay);
      delay = Math.min(delay * 2, MAX_MS);
    },
    clear() {
      window.clearTimeout(timer);
      timer = 0;
    },
    reset() {
      delay = MIN_MS;
    },
  };
}

export function onVisible(fn: () => void): () => void {
  const handle = () => {
    if (!document.hidden) fn();
  };
  document.addEventListener('visibilitychange', handle);
  return () => document.removeEventListener('visibilitychange', handle);
}
