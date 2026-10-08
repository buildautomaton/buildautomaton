import type { DashboardLayoutId } from './layouts.js';
import type { UiPlugin } from './plugin.js';

export function layoutPlugin(id: DashboardLayoutId): UiPlugin {
  return {
    name: `layout-${id}`,
    description: `Dashboard layout ${id}. Use to pick the shell chrome before other UI plugins paint surfaces.`,
    targetRuntime: 'react',
    implementation: { layout: id },
  };
}
