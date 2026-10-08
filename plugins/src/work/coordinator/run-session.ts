import type { SessionRecord } from '@plugins/work/host.js';
import { AGENT_CONFIG_AGENT_MODEL_KEY } from '@plugins/harnesses/acp/util/agent-config.js';
import type { CoordinatorContext, CoordinatorStatus } from './types.js';

export function runSessionTurn(
  ctx: CoordinatorContext,
  record: SessionRecord,
  onStatus: (next: CoordinatorStatus) => void,
): void {
  ctx.engine.setPreferredHarnessType(record.harness);
  ctx.engine.prompt({
    promptText: record.prompt,
    sessionId: record.id,
    runId: record.runId,
    scopeId: record.id,
    agentType: record.harness,
    agentConfig: record.model ? { [AGENT_CONFIG_AGENT_MODEL_KEY]: record.model } : undefined,
    cwd: record.cwd,
    isNewSession: true,
    sendResult: (result) => {
      if (!result.success) {
        void ctx.backend.patch(record.id, { status: 'failed', error: result.error });
        onStatus({ status: 'failed', sessionId: record.id, harness: record.harness, error: result.error });
        ctx.log(`[BuildAutomaton] Session ${record.id} failed: ${result.error ?? 'unknown error'}`);
        return;
      }
      void ctx.backend.patch(record.id, { status: 'completed' });
    },
    sendSessionUpdate: () => undefined,
  });
}
