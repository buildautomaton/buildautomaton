import { registerService } from '@buildautomaton/runtime';
import { applyHttpPlugin } from './apply.js';
import type { HttpPlugin } from './types/plugin.js';

registerService('http', (slots, plugin) => applyHttpPlugin(slots, plugin as HttpPlugin), 30);
