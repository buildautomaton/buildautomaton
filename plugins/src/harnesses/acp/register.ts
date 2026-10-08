import { registerService } from '@buildautomaton/runtime';
import { applyAcpPlugin } from './apply.js';

registerService('acp', (slots) => applyAcpPlugin(slots), 90);
