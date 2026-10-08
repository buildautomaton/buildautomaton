import type { PluginSlots } from '@buildautomaton/runtime';
import { composeAcpRuntime } from './compose/compose-runtime.js';

export function applyAcpPlugin(slots: PluginSlots): void {
  slots.extras.compose = composeAcpRuntime;
}
