import { randomUUID } from 'node:crypto';
import { isoNow } from '@plugins/harnesses/acp/compose/iso-now.js';
import type { CoordinatorContext, CoordinatorStatus, ContinueSessionInput, StartSessionResult } from './types.js';
import { appendTurnEvent, userMessagePayload } from './persist-turn.js';
import { runSessionTurn } from './run-session.js';

export async function continueSession(
  ctx: CoordinatorContext,
  input: ContinueSessionInput,
  onStatus: (next: CoordinatorStatus) => void,
): Promise<StartSessionResult> {
  const snapshot = await ctx.backend.get(input.sessionId);
  if (!snapshot) {
    const status: CoordinatorStatus = { status: 'failed', sessionId: input.sessionId, error: 'Session not found' };
    onStatus(status);
    return status;
  }
  const prompt = input.prompt.trim();
  const now = isoNow();
  const runId = randomUUID();
  const record = {
    ...snapshot.session,
    status: 'running' as const,
    runId,
    updatedAt: now,
    model: input.model ?? snapshot.session.model,
  };
  await ctx.backend.patch(record.id, { status: 'running', runId, updatedAt: now, error: undefined, model: record.model });
  appendTurnEvent(ctx.backend, record.id, 'update', userMessagePayload(prompt));
  const status: CoordinatorStatus = { status: 'running', sessionId: record.id, harness: record.harness };
  onStatus(status);
  ctx.log(`[BuildAutomaton] Continue ${record.id} on ${record.harness}`);
  runSessionTurn(ctx, record, onStatus, { isNewSession: false, promptText: prompt });
  return status;
}
