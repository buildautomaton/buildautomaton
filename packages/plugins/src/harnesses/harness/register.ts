import { registerService } from '@buildautomaton/runtime';
import { applyHarnessPlugin } from './apply.js';
import type { HarnessPlugin } from './plugin.js';

registerService('harness', (slots, plugin) => applyHarnessPlugin(slots, plugin as HarnessPlugin), 50);
