import type { PluginSlots } from '@buildautomaton/runtime';
import { asHost } from '../../host-slots.js';
import type { FileStorePlugin } from './plugin.js';

export function applyFileStorePlugin(slots: PluginSlots, plugin: FileStorePlugin): void {
  asHost(slots).fileStore = plugin.implementation;
}
