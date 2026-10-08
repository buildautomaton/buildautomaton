import { registerService } from '@buildautomaton/runtime';
import { applyFileStorePlugin } from './apply.js';
import type { FileStorePlugin } from './plugin.js';

registerService('file-store', (slots, plugin) => applyFileStorePlugin(slots, plugin as FileStorePlugin), 10);
