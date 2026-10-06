import { registerService } from '@buildautomaton/runtime';
import { applyExtensionPlugin } from './apply-extension.js';

registerService('*', (slots, plugin) => applyExtensionPlugin(slots, plugin), 1000);
