import type { ArtifactKind } from '@plugins/buildautomaton/types/artifact/kind.js';

const BASE = `You have buildautomaton tools.

This session already has work from the user's prompt. Implement it.
When finished, call tell_buildautomaton_what_was_built with the sessionId from this prompt (also echoed in tell structuredContent), project, and artifacts.
Keep that sessionId for the whole agent session: reuse it on every tell; do not invent a new one.
The sessionId is an MCP explicit state handle — read it from the session prompt and thread it into tell.
On tell: always pass summary and changesOverview for code changes, plus ui/api/dataModel/algorithm whenever those surfaces changed. Do not stop after summary/changesOverview.
If you need a product decision, interview with ask_buildautomaton_interview_questions: exactly one question per call, 2–6 options with a recommended choice and a "Something else" option, then wait for the answer before continuing.`;

export function workInstructions(artifacts: ArtifactKind[]): string {
  const extra = artifacts.map((kind) => kind.instructions ?? kind.description).filter(Boolean);
  return [BASE, ...extra].join('\n\n');
}

export const WORK_INSTRUCTIONS = workInstructions([]);
