import type { AttachFetch } from '@plugins/host-slots.js';
import { createMcpSseHub } from './sse-hub.js';
import { handleFetchRequest } from './handle-fetch.js';

export const attachFetch: AttachFetch = (handle, opts) => {
  const sse = createMcpSseHub();
  const initialized = { value: false };
  return {
    ...handle,
    fetch: (request) =>
      handleFetchRequest(request, { ...opts, tools: opts.tools, initialized, log: opts.log, sse }),
    stop: async () => {
      sse.close();
      await handle.stop();
    },
  };
};
