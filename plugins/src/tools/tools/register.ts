import { registerService } from '@buildautomaton/runtime';
import { applyToolsPlugin } from './apply.js';
import type { ToolsPlugin } from './plugin.js';

registerService('tools', (slots, plugin) => applyToolsPlugin(slots, plugin as ToolsPlugin), 60);
