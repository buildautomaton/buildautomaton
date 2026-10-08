import { defineHarnessPlugin } from '@plugins/harnesses/define-plugin.js';
import { opencodeHarnessOptions, opencodeHarnessImplementation } from './definition.js';

export const opencodeHarnessPlugin = defineHarnessPlugin(
  'harness-opencode',
  opencodeHarnessOptions,
  opencodeHarnessImplementation,
  'OpenCode agent harness. Use when the host should spawn OpenCode as the coding agent.',
);
