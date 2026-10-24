import { registerService } from '@buildautomaton/runtime';
import { applyToolsPlugin } from './apply.js';
import type { ToolsPlugin } from './plugin.js';

registerService('tools', (slots, plugin, contrib) => applyToolsPlugin(slots, plugin as ToolsPlugin, contrib), 60);
