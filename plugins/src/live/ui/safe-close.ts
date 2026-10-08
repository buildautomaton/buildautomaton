/** Browser close. `close()` while CONNECTING logs "closed before the connection is established". */
export function safeCloseWs(ws: WebSocket | undefined): void {
  if (!ws) return;
  ws.onerror = () => undefined;
  ws.onmessage = null;
  if (ws.readyState === WebSocket.CONNECTING) {
    ws.onopen = () => {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    };
    return;
  }
  if (ws.readyState === WebSocket.OPEN) {
    try {
      ws.close();
    } catch {
      /* ignore */
    }
  }
}
