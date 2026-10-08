import { registerService } from '@buildautomaton/runtime';
import { applySqlStorePlugin } from './apply.js';
import type { SqlStorePlugin } from './plugin.js';

registerService('sql-store', (slots, plugin) => applySqlStorePlugin(slots, plugin as SqlStorePlugin), 20);
