export const DASHBOARD_LAYOUTS = ['app', 'master-detail', 'columns'] as const;
export type DashboardLayoutId = (typeof DASHBOARD_LAYOUTS)[number];

export const ALL_PANELS = ['nav', 'main', 'master', 'detail', 'column', 'header'] as const;
export type DashboardPanelId = (typeof ALL_PANELS)[number];

export const LAYOUT_PANELS: Record<DashboardLayoutId, readonly DashboardPanelId[]> = {
  app: ['nav', 'main'],
  'master-detail': ['nav', 'master', 'detail'],
  columns: ['nav', 'column', 'header'],
};

export const DEFAULT_LAYOUT: DashboardLayoutId = 'app';
export const DEFAULT_PANELS = LAYOUT_PANELS.app;
