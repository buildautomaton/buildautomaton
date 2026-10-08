import type { IncomingMessage, ServerResponse } from 'node:http';
import { clearCommandPresenceCache } from '@plugins/harnesses/acp/clients/presence-cache.js';
import { forgetAgentModels } from './agent-model-cache.js';
import type { AgentHarness, HttpRegistry } from '@plugins/work/host.js';
import { readJson, writeJson } from './io.js';
import { clearSetupCache } from './setup-cache.js';
import { installBuildAutomatonAgent } from './setup-install.js';
import { allowsBuildAutomatonOrigin } from './setup-origin.js';
import { describeSetup } from './setup-status.js';
import { warmAgentModels } from './warm-models.js';
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
  void describeSetup(cwd, harnesses)
    .then((setup) =>
      warmAgentModels({
        cwd,
        harnesses,
        detected: setup.agents.filter((agent) => agent.detected).map((agent) => agent.type),
      }),
    )
    .catch(() => undefined);
}

async function handleSetup(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string,
  cwd: string,
  harnesses: readonly AgentHarness[],
  extras: Record<string, unknown>,
): Promise<void> {
  if (!allowsBuildAutomatonOrigin(header(req, 'origin'), header(req, 'host'))) {
    writeJson(res, 403, { error: 'Cross-origin request blocked' });
    return;
  }
  const tail = pathname === '/api/buildautomaton' ? '' : pathname.slice('/api/buildautomaton/'.length);
  if (!tail && req.method === 'GET') {
    const setup = await describeSetup(cwd, harnesses);
    warmAgentModels({
      cwd,
      harnesses,
      detected: setup.agents.filter((agent) => agent.detected).map((agent) => agent.type),
      prefer: preferParam(req.url),
    });
    writeJson(res, 200, { ...setup, coordinator: coordinatorSetup(extras) });
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
  const result = await installBuildAutomatonAgent(harnesses, type, body?.token ?? '');
  if (result.success) {
    clearSetupCache();
    clearCommandPresenceCache();
    forgetAgentModels(type);
  }
  writeJson(res, result.success ? 200 : 400, result);
}

function header(req: IncomingMessage, name: string): string | undefined {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function preferParam(url: string | undefined): string | undefined {
  const query = url?.includes('?') ? url.slice(url.indexOf('?') + 1) : '';
  const prefer = new URLSearchParams(query).get('prefer')?.trim();
  return prefer || undefined;
}
