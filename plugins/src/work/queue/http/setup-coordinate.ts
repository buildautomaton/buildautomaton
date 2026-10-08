import type { IncomingMessage, ServerResponse } from 'node:http';
import type { CoordinatorImplementation } from '../../coordinator/types.js';
import type { CoordinatorSetup } from './setup-status.js';
import { readJson, writeJson } from './io.js';

export async function postSession(
  req: IncomingMessage,
  res: ServerResponse,
  extras: Record<string, unknown>,
): Promise<void> {
  const coordinator = extras.coordinator as CoordinatorImplementation | undefined;
  if (!coordinator) {
    writeJson(res, 503, { error: 'Coordinator plugin is not loaded' });
    return;
  }
  const body = (await readJson(req).catch(() => null)) as {
    prompt?: string;
    project?: string;
    harness?: string;
    model?: string;
  } | null;
  const prompt = body?.prompt?.trim() ?? '';
  if (!prompt) {
    writeJson(res, 400, { error: 'prompt is required' });
    return;
  }
  const result = await coordinator.start({
    prompt,
    project: body?.project,
    harness: body?.harness?.trim() || undefined,
    model: body?.model?.trim() || undefined,
  });
  if (result.status === 'failed' && !result.work) {
    writeJson(res, 500, result);
    return;
  }
  writeJson(res, result.status === 'waiting' ? 200 : 201, result);
}

export function coordinatorSetup(extras: Record<string, unknown>): CoordinatorSetup {
  const coordinator = extras.coordinator as CoordinatorImplementation | undefined;
  return coordinator?.status() ?? { status: 'idle' };
}
