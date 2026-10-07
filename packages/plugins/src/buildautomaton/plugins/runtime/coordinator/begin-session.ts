import { randomUUID } from 'node:crypto';
import type { WorkImplementation } from '@plugins/buildautomaton/types/work/implementation.js';
import type { CoordinatorContext, CoordinatorStatus, StartSessionInput, StartSessionResult } from './types.js';
import { pickCoordinatorHarness } from './pick-harness.js';
import { buildSessionPrompt } from './prompt.js';
import { titleFromPrompt } from './title.js';
import { runSessionTurn } from './run-session.js';

export async function beginSession(
  ctx: CoordinatorContext,
  input: StartSessionInput,
  onStatus: (next: CoordinatorStatus) => void,
): Promise<StartSessionResult> {
  const work = ctx.extras.work as WorkImplementation | undefined;
  if (!work) {
    const status: CoordinatorStatus = { status: 'failed', error: 'Work plugin is not loaded' };
    onStatus(status);
    return status;
  }
  const harness = await pickCoordinatorHarness(ctx.engine);
  if (!harness) {
    const status: CoordinatorStatus = { status: 'waiting' };
    onStatus(status);
    return status;
  }
  return launch(ctx, work, harness.type, input, onStatus);
}

async function launch(
  ctx: CoordinatorContext,
  work: WorkImplementation,
  harness: string,
  input: StartSessionInput,
  onStatus: (next: CoordinatorStatus) => void,
): Promise<StartSessionResult> {
  const prompt = input.prompt.trim();
  const item = await work.addWork({
    title: titleFromPrompt(prompt),
    content: prompt,
    prompt,
    project: input.project,
    started: true,
  });
  const now = new Date().toISOString();
  const id = randomUUID();
  const record = {
    id,
    harness,
    prompt: buildSessionPrompt(prompt, id, input.project),
    cwd: ctx.cwd,
    status: 'running' as const,
    runId: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await ctx.backend.create(record);
  await work.attachSession(item.id, id);
  const status: CoordinatorStatus = { status: 'running', sessionId: id, harness };
  onStatus(status);
  ctx.log(`[Buildautomaton] Session ${id} on ${harness}`);
  runSessionTurn(ctx, record, onStatus);
  return { ...status, work: item };
}
