import { defineHarnessPlugin } from '@plugins/harnesses/define-plugin.js';
import { kiroHarnessOptions, kiroHarnessImplementation } from './definition.js';

export const kiroHarnessPlugin = defineHarnessPlugin(
  'harness-kiro',
  kiroHarnessOptions,
  kiroHarnessImplementation,
  'Kiro agent harness. Use when the host should spawn Kiro as the coding agent.',
);
