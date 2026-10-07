import type { McpToolDefinition } from '@plugins/buildautomaton/host.js';
import type { ArtifactKind } from '@plugins/buildautomaton/types/artifact/kind.js';
import { ASK_BUILDAUTOMATON_WHAT_TO_BUILD_NEXT_DEFINITION } from './ask-def.js';
import { tellWhatWasBuiltDefinition } from './tell-def.js';
import { ASK_BUILDAUTOMATON_INTERVIEW_QUESTIONS_DEFINITION } from './interview-def.js';
import { builtinArtifactKinds } from '../artifacts/builtins.js';

export function workToolDefinitions(artifacts: ArtifactKind[]): McpToolDefinition[] {
  return [
    ASK_BUILDAUTOMATON_WHAT_TO_BUILD_NEXT_DEFINITION,
    ASK_BUILDAUTOMATON_INTERVIEW_QUESTIONS_DEFINITION,
    tellWhatWasBuiltDefinition(artifacts),
  ];
}

export const WORK_TOOL_DEFINITIONS: McpToolDefinition[] = workToolDefinitions(builtinArtifactKinds());
