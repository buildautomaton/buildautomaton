import type { PluginRuntimeContext, ServiceContribution } from '@plugins/work/host.js';
import type { ArtifactKind } from './kind.js';

export type ArtifactPlugin = {
  name: string;
  description?: string;
  targetRuntime?: 'node' | 'react';
  services: ServiceContribution[];
  artifact: ArtifactKind;
  runtime?: PluginRuntimeContext;
};
