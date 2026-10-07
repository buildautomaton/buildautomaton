import type { ArtifactFile } from '@plugins/buildautomaton/types/work/artifact.js';
import { file } from '@plugins/buildautomaton/plugins/runtime/work/artifacts/file.js';

/** Non-UI artifacts are stored as markdown; styling is applied at render time. */
export function mdFile(base: string, markdown: string): ArtifactFile[] {
  return [file(`${base}.md`, markdown)];
}
