import { agentPathEnv } from '@plugins/harnesses/acp/clients/agent-path.js';
import { runStreamingCommand } from '@plugins/harnesses/acp/host/install/run-streaming-command.js';
import type { AgentInstallContext } from '@plugins/harnesses/harness/host.js';
export const cursorInstallDetectCommand = 'agent';
export const cursorInstallAlternateDetectCommands = ['cursor-agent'];
export const cursorInstallTokenEnvVar = 'CURSOR_API_KEY';

export async function installCursor(ctx: AgentInstallContext): Promise<void> {
  ctx.onProgress?.('Installing Cursor CLI');
  const result = await runStreamingCommand(
    'bash',
    ['-lc', 'curl -fsSL https://cursor.com/install | bash'],
    {
      timeoutMs: 300_000,
      env: { ...agentPathEnv(ctx.env), CURSOR_API_KEY: ctx.authToken },
      onLine: (line: string) => ctx.onProgress?.('Installing Cursor CLI', line),
    },
  );
  if (result.code !== 0) {
    throw new Error(`Cursor CLI install failed (exit ${result.code ?? 'signal'})`);
  }
}
