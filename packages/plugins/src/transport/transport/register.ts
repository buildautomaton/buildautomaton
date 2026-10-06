import { registerService } from '@buildautomaton/runtime';
import { applyTransportPlugin } from './apply.js';
import type { TransportPlugin } from './plugin.js';

registerService('transport', (slots, plugin) => applyTransportPlugin(slots, plugin as TransportPlugin), 70);
