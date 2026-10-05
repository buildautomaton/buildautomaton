import { appPlugin, coreSet, HTTP_DEFAULT_HOST, runRuntime, type RuntimeOptions } from '@buildautomaton/runtime';
import { directorHttpEndpoints, productDirectorSet } from '@buildautomaton/product-director';
import type { ParsedCli } from './parse-cli.js';
import { createLog, writeInfo } from './log.js';
import { openUi } from './open-ui.js';
import { CLI_VERSION } from './version.js';

export function appUiUrl(parsed: ParsedCli): string {
  return `http://${HTTP_DEFAULT_HOST}:${parsed.mcpPort}/`;
}

export function formatCliStartup(parsed: ParsedCli): string {
  const remote = parsed.remoteUrl ? ` remoteUrl=${parsed.remoteUrl}` : '';
  const http =
    parsed.transport === 'http'
      ? ` url=http://${HTTP_DEFAULT_HOST}:${parsed.mcpPort}${parsed.mcpPath}`
      : '';
  const ui = parsed.mode === 'app' ? ` ui=${appUiUrl(parsed)}` : '';
  return `[CLI] Starting local-cli ${CLI_VERSION} mode=${parsed.mode} transport=${parsed.transport} cwd=${parsed.cwd} backend=${parsed.backend}${http}${ui}${remote}`;
}

export function runtimeOptionsFromCli(parsed: ParsedCli): RuntimeOptions {
  const log = createLog(parsed.verbose);
  const runtime = { cwd: parsed.cwd, log };
  return {
    cwd: parsed.cwd,
    log,
    plugins: [
      ...coreSet({
        options: {
          cwd: parsed.cwd,
          sessionsDir: parsed.sessionsDir,
          backend: parsed.backend,
          transport: parsed.transport,
          remoteUrl: parsed.remoteUrl,
          mcpPort: parsed.mcpPort,
          mcpPath: parsed.mcpPath,
          httpEndpoints: directorHttpEndpoints(),
        },
        runtime,
      }),
      ...productDirectorSet({ runtime }),
      ...(parsed.mode === 'app' ? [appPlugin({ runtime })] : []),
    ],
  };
}

export async function runCli(parsed: ParsedCli): Promise<void> {
  if (parsed.transport === 'remote' && !parsed.remoteUrl) {
    console.error('Missing --remote-url for --transport remote.');
    process.exit(1);
  }
  if (parsed.mode === 'app' && parsed.transport !== 'http') {
    console.error('App mode serves a UI and needs HTTP. Omit --transport or pass --transport http.');
    process.exit(1);
  }
  writeInfo(formatCliStartup(parsed));
  if (parsed.mode === 'app') openUi(appUiUrl(parsed));
  await runRuntime(runtimeOptionsFromCli(parsed));
}
