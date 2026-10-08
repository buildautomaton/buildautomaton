import type { DashboardLayoutId } from './layouts.js';
import type { UiPlugin } from './plugin.js';

export function layoutPlugin(id: DashboardLayoutId): UiPlugin {
  return {
    name: `layout-${id}`,
    implementation: { layout: id },
  };
}
