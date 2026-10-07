import type { ToolContext } from '@plugins/buildautomaton/host.js';
import type { WorkImplementation } from '@plugins/buildautomaton/types/work/implementation.js';
import type { ArtifactKind } from '@plugins/buildautomaton/types/artifact/kind.js';

export function workFrom(ctx: ToolContext): WorkImplementation | undefined {
  const value = ctx.extras.work;
  return value && typeof value === 'object' ? (value as WorkImplementation) : undefined;
}

export function artifactsFrom(ctx: ToolContext): ArtifactKind[] {
  return Array.isArray(ctx.extras.artifacts) ? (ctx.extras.artifacts as ArtifactKind[]) : [];
}
