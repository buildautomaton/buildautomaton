import type { ServerResponse } from 'node:http';

export function collectFetchResponse(): { res: ServerResponse; done: Promise<Response> } {
  let status = 200;
  const headers = new Headers();
  const chunks: Uint8Array[] = [];
  let settle: (value: Response) => void;
  const done = new Promise<Response>((resolve) => {
    settle = resolve;
  });
  const res = {
    statusCode: 200,
    writeHead(code: number, hdrs?: Record<string, string | string[]>) {
      status = code;
      this.statusCode = code;
      applyHeaders(headers, hdrs);
      return this;
    },
    setHeader(name: string, value: string | number | readonly string[]) {
      headers.set(name, String(value));
      return this;
    },
    write(chunk?: string | Uint8Array) {
      if (chunk) chunks.push(asBytes(chunk));
      return true;
    },
    end(chunk?: string | Uint8Array) {
      if (chunk) chunks.push(asBytes(chunk));
      settle(new Response(bufferOf(concat(chunks)), { status, headers }));
    },
  } as ServerResponse;
  return { res, done };
}

function applyHeaders(headers: Headers, hdrs?: Record<string, string | string[]>): void {
  if (!hdrs) return;
  for (const [key, value] of Object.entries(hdrs)) {
    headers.set(key, Array.isArray(value) ? value.join(', ') : value);
  }
}

function asBytes(chunk: string | Uint8Array): Uint8Array {
  return typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk;
}

function bufferOf(bytes: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return copy;
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.byteLength, 0));
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}
