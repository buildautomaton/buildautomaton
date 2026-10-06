import { runNpmGlobalInstall } from '@plugins/harnesses/acp/host/install/commands/run-npm-global-install.js';
import type { AgentInstallContext } from '@plugins/harnesses/harness/host.js';
export const opencodeInstallDetectCommand = 'opencode';
export const opencodeInstallTokenEnvVar = 'OPENCODE_API_KEY';

export async function installOpencode(ctx: AgentInstallContext): Promise<void> {
  ctx.onProgress?.('Installing OpenCode');
  await runNpmGlobalInstall(
    'opencode-ai',
    { ...ctx.env, OPENCODE_API_KEY: ctx.authToken },
    { onLine: (line: string) => ctx.onProgress?.('Installing OpenCode', line) },
  );
}
