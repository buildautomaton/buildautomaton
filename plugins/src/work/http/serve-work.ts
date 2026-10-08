import * as http from 'node:http';
import {
  createHttpRegistry,
  createMcpSseHub,
  handleHttpRequest,
} from '@plugins/work/host.js';
import type { WorkImplementation } from '@plugins/work/types/work/implementation.js';
import { contributeWorkHttp } from '../queue/http/contribute.js';

export function serveWork(work: WorkImplementation) {
  const registry = createHttpRegistry();
  contributeWorkHttp(registry, {
    cwd: '/tmp',
    log: () => {},
    extras: { work },
    pluginName: 'work',
  });
  const sse = createMcpSseHub();
  const server = http.createServer((req, res) => {
    void handleHttpRequest(req, res, {
      path: '/mcp',
      routes: registry.routes(),
      tools: { listTools: async () => [], callTool: async () => ({ content: [] }) },
      initialized: { value: false },
      log: () => {},
      sse,
    });
  });
  return { server, sse };
}
