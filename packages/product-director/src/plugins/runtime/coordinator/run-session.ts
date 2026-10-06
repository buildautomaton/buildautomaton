import type { SessionRecord } from '@buildautomaton/plugins';
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
    cwd: record.cwd,
    isNewSession: true,
    sendResult: (result) => {
      if (!result.success) {
        void ctx.backend.patch(record.id, { status: 'failed', error: result.error });
        onStatus({ status: 'failed', sessionId: record.id, harness: record.harness, error: result.error });
        ctx.log(`[Director] Session ${record.id} failed: ${result.error ?? 'unknown error'}`);
        return;
      }
      void ctx.backend.patch(record.id, { status: 'completed' });
    },
    sendSessionUpdate: () => undefined,
  });
}
