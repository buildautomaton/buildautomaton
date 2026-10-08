import type { ArtifactPlugin, ArtifactKind } from '@plugins/work/types/artifact/index.js';

export function artifactPlugin(name: string, artifact: ArtifactKind): ArtifactPlugin {
  return {
    name,
    description: artifact.description,
    targetRuntime: 'node',
    artifact,
    services: [{ id: 'artifact', implementation: artifact }],
  };
}
