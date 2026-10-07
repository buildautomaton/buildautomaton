import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AgentHarness, HttpRegistry } from '@plugins/buildautomaton/host.js';
import { readJson, writeJson } from './io.js';
import { installBuildautomatonAgent } from './setup-install.js';
import { allowsBuildautomatonOrigin } from './setup-origin.js';
import { describeSetup } from './setup-status.js';
import { coordinatorSetup, postSession } from './setup-coordinate.js';

export function contributeSetupRoutes(
  http: HttpRegistry,
  cwd: string,
  harnesses: readonly AgentHarness[],
  extras: Record<string, unknown> = {},
): void {
  http.addRoute({
    path: '/api/buildautomaton',
    handler: (req, res, hit) => handleSetup(req, res, hit.pathname, cwd, harnesses, extras),
  });
}

async function handleSetup(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
  cwd: string,
  harnesses: readonly AgentHarness[],
  extras: Record<string, unknown>,
): Promise<void> {
  if (!allowsBuildautomatonOrigin(header(req, 'origin'), header(req, 'host'))) {
    writeJson(res, 403, { error: 'Cross-origin request blocked' });
    return;
  }
  const tail = pathname === '/api/buildautomaton' ? '' : pathname.slice('/api/buildautomaton/'.length);
  if (!tail && req.method === 'GET') {
    writeJson(res, 200, { ...(await describeSetup(cwd, harnesses)), coordinator: coordinatorSetup(extras) });
    return;
  }
  if (tail === 'install' && req.method === 'POST') {
    await postInstall(req, res, harnesses);
    return;
  }
  if (tail === 'session' && req.method === 'POST') {
    await postSession(req, res, extras);
    return;
  }
  writeJson(res, 404, { error: 'Not found' });
}

async function postInstall(req: IncomingMessage, res: ServerResponse, harnesses: readonly AgentHarness[]): Promise<void> {
  const body = (await readJson(req).catch(() => null)) as { type?: string; token?: string } | null;
  const type = body?.type?.trim() ?? '';
  if (!type) {
    writeJson(res, 400, { error: 'type is required' });
    return;
  }
  const result = await installBuildautomatonAgent(harnesses, type, body?.token ?? '');
  writeJson(res, result.success ? 200 : 400, result);
}

function header(req: IncomingMessage, name: string): string | undefined {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}
