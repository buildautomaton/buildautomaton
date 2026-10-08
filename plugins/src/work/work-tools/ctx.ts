import type { ToolContext } from '@plugins/work/host.js';
import type { WorkImplementation } from '@plugins/work/types/work/implementation.js';
import type { ArtifactKind } from '@plugins/work/types/artifact/kind.js';

export function workFrom(ctx: ToolContext): WorkImplementation | undefined {
  const value = ctx.extras.work;
  return value && typeof value === 'object' ? (value as WorkImplementation) : undefined;
}

export function artifactsFrom(ctx: ToolContext): ArtifactKind[] {
  return Array.isArray(ctx.extras.artifacts) ? (ctx.extras.artifacts as ArtifactKind[]) : [];
}
