import type { PluginRuntimeContext, ServiceContribution } from '@plugins/buildautomaton/host.js';
import type { ArtifactKind } from './kind.js';

export type ArtifactPlugin = {
  name: string;
  services: ServiceContribution[];
  artifact: ArtifactKind;
  runtime?: PluginRuntimeContext;
};
