import type { PluginSlots, RuntimeHandle, RuntimeOptions } from '@buildautomaton/runtime';
import { RUNTIME_VERSION } from '@buildautomaton/runtime';
import { asHost } from '../../../host-slots.js';
import { mergeToolRegistries } from '../../../tools/tools/merge-registries.js';
import type { ToolContext, ToolRegistry, ToolsImplementation } from '../../../tools/tools/implementation.js';
import { createAcpEngine } from '../engine/create-acp-engine.js';
import { createNotifierHub } from '../notify/hub.js';
import { bindHandle } from './bind-handle.js';
import { buildClientHostHooks } from './build-client-host.js';
import { createAccessPort } from './local-mcp.js';
import { onListening } from './on-listening.js';
import { withLocalMcp } from './with-local-mcp.js';
import { wrapBackend } from './wrap-backends.js';
import { contributeHttp } from './contribute-http.js';
import { toolsHttpPath } from './tools-http-path.js';

function toolsFrom(impls: ToolsImplementation[], ctx: ToolContext): ToolRegistry {
  return mergeToolRegistries(
    impls.map((impl) => ({
      listTools: () => impl.listTools(ctx),
      callTool: (name, args, extras) => impl.callTool(name, args, ctx, extras),
      instructions: impl.instructions ? () => impl.instructions!(ctx) : undefined,
      prompts: impl.prompts ? () => impl.prompts!() : undefined,
    })),
  );
}

export async function composeAcpRuntime(
  slots: PluginSlots,
  options: RuntimeOptions & { log: (line: string) => void },
): Promise<RuntimeHandle> {
  const host = asHost(slots);
  if (!host.backend) throw new Error('createRuntime requires a session plugin');
  if (!host.transport) throw new Error('createRuntime requires a transport plugin');
  const backend = wrapBackend(host.backend, host.backendWraps);
  contributeHttp(slots, { cwd: options.cwd, log: options.log, backend });
  const access = createAccessPort();
  const engine = await createAcpEngine({
    log: options.log,
    isShutdownRequested: options.isShutdownRequested,
    clientHostHooks: withLocalMcp(
      await buildClientHostHooks({ backend, harnessHooks: host.harnessHooks, harnessHost: host.harnessHost }),
      access,
    ),
    clientInfo: { name: 'meta-harness', version: RUNTIME_VERSION },
  });
  for (const harness of host.harnesses) engine.registerHarness(harness);
  const notifier = createNotifierHub();
  const tools = toolsFrom(host.tools, {
    cwd: options.cwd,
    engine,
    backend,
    sessionHooks: host.sessionHooks,
    toolsHooks: host.toolsHooks,
    notifier,
    extras: slots.extras,
  });
  const handle = bindHandle({
    cwd: options.cwd,
    engine,
    transport: host.transport,
    tools,
    transportHooks: host.transportHooks,
    notifier,
    http: host.http,
    plugins: slots.pluginRegistry,
    services: slots.services,
    onListening: onListening({
      access,
      transportHooks: host.transportHooks,
      extras: slots.extras,
      engine,
      backend,
      cwd: options.cwd,
      log: options.log,
    }),
  });
  const fetchOpts = { path: toolsHttpPath(host.httpEndpoints), routes: host.http?.routes() ?? [], tools, log: options.log };
  if (!host.attachFetch) {
    return { ...handle, fetch: async () => new Response('No HTTP fetch handler', { status: 501 }) };
  }
  return host.attachFetch(handle, fetchOpts);
}
