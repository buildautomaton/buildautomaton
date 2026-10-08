/** Forward ACP session events to the host; also invoke optional plugin hooks. */

import type { AcpClientOptions } from '@plugins/harnesses/acp/client-types.js';
import type { ClientHostHooks } from '@plugins/harnesses/acp/engine/types.js';
import type { AgentFileChangeEvent, AgentRuntimeRequest } from '@plugins/harnesses/acp/session-kinds.js';
import { mapRequestKind } from './map-request-kind.js';

function safe(run: () => void): void {
  try {
    run();
  } catch {
    /* host persist/UI must not become JSON-RPC [-32603] */
  }
}

export function acpSessionHooks(params: {
  hostHooks?: ClientHostHooks;
  sendSessionUpdate: (payload: unknown) => void;
  sendRequest: (payload: unknown) => void;
}): Pick<AcpClientOptions, 'onSessionUpdate' | 'onRequest' | 'onFileChange'> {
  const { hostHooks, sendSessionUpdate, sendRequest } = params;
  return {
    onSessionUpdate: (payload) => {
      safe(() => sendSessionUpdate(payload));
      safe(() => hostHooks?.onSessionUpdate?.(payload));
    },
    onRequest: (request) => {
      safe(() => sendRequest(requestPayload(request)));
      safe(() => hostHooks?.onRequest?.(request));
    },
    onFileChange: (evt) => {
      safe(() => sendSessionUpdate(fileChangePayload(evt)));
      safe(() => hostHooks?.onFileChange?.(evt));
    },
  };
}

function requestPayload(request: AgentRuntimeRequest) {
  return {
    type: 'session_update',
    requestId: request.requestId,
    kind: mapRequestKind(request.method),
    payload: {
      sessionUpdate: mapRequestKind(request.method),
      requestId: request.requestId,
      method: request.method,
      params: request.params,
    },
  };
}

function fileChangePayload(evt: AgentFileChangeEvent) {
  return { sessionUpdate: 'file_change', path: evt.path, oldText: evt.oldText, newText: evt.newText };
}
