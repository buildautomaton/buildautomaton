import { defineHarnessPlugin } from '@plugins/harnesses/define-plugin.js';
import { claudeCodeHarnessOptions, claudeCodeHarnessImplementation } from './definition.js';

export const claudeCodeHarnessPlugin = defineHarnessPlugin(
  'harness-claude-code',
  claudeCodeHarnessOptions,
  claudeCodeHarnessImplementation,
  'Claude Code agent harness. Use when the host should spawn Claude Code as the coding agent.',
);
