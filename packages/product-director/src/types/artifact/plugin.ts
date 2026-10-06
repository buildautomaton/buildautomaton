import type { PluginRuntimeContext } from '@buildautomaton/plugins';
import type { ArtifactKind } from './kind.js';

export type ArtifactPlugin = {
  name: string;
  kind: 'artifact';
  artifact: ArtifactKind;
  runtime?: PluginRuntimeContext;
};
