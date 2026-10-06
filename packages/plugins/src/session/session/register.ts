import { registerService } from '@buildautomaton/runtime';
import { applySessionPlugin } from './apply.js';
import type { SessionPlugin } from './plugin.js';

registerService('session', (slots, plugin) => applySessionPlugin(slots, plugin as SessionPlugin), 40);
