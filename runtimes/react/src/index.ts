export { createUi } from './core/create-ui.js';
export { createUiSlots } from './core/apply.js';
export { layoutPlugin } from './core/layout-plugin.js';
export { DEFAULT_PANELS, DEFAULT_LAYOUT, DASHBOARD_LAYOUTS, ALL_PANELS } from './core/slots.js';
export type { DashboardLayoutId, DashboardPanelId } from './core/slots.js';
export type {
  UiPlugin,
  TargetRuntime,
  UiSurface,
  UiProviderContribution,
  UiHooks,
  SurfaceProps,
} from './core/plugin.js';
export type { UiHost, CreateUiOptions } from './core/create-ui.js';
export { DashboardShell } from './dashboard/shell.js';
export { ColumnFocusButton } from './dashboard/column-focus-button.js';
export { useUiHost } from './dashboard/host.js';
export { surfacesForPanel } from './dashboard/surfaces-for-panel.js';
export * from './design/index.js';
