import type { PluginRuntimeContext, ServiceContribution } from '@buildautomaton/plugins';
import type { ArtifactKind } from './kind.js';

export type ArtifactPlugin = {
  name: string;
  services: ServiceContribution[];
  artifact: ArtifactKind;
  runtime?: PluginRuntimeContext;
};
