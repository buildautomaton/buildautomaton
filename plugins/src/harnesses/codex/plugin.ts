import { defineHarnessPlugin } from '@plugins/harnesses/define-plugin.js';
import { codexHarnessOptions, codexHarnessImplementation } from './definition.js';

export const codexHarnessPlugin = defineHarnessPlugin(
  'harness-codex',
  codexHarnessOptions,
  codexHarnessImplementation,
  'Codex agent harness. Use when the host should spawn Codex as the coding agent.',
);
