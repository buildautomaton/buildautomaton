import type { ArtifactKind } from '@plugins/buildautomaton/types/artifact/kind.js';
import type { ArtifactPlugin } from '@plugins/buildautomaton/types/artifact/plugin.js';
import { summaryArtifactPlugin } from './summary.js';
import { changesOverviewArtifactPlugin } from './changes-overview.js';
import { apiArtifactPlugin } from './api.js';
import { dataModelArtifactPlugin } from './data-model.js';
import { uiArtifactPlugin } from './ui.js';
import { algorithmArtifactPlugin } from './algorithm.js';

export function artifactPlugins(): ArtifactPlugin[] {
  return [
    summaryArtifactPlugin(),
    changesOverviewArtifactPlugin(),
    apiArtifactPlugin(),
    dataModelArtifactPlugin(),
    uiArtifactPlugin(),
    algorithmArtifactPlugin(),
  ];
}

export function builtinArtifactKinds(): ArtifactKind[] {
  return artifactPlugins().map((plugin) => plugin.artifact);
}
