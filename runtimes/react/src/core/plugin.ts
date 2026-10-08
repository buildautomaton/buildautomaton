import type { ComponentType, ReactNode } from 'react';
import type { DashboardLayoutId, DashboardPanelId } from './layouts.js';

export type SurfaceProps = {
  panel: string;
};

export type UiSurface = {
  id: string;
  title: string;
  /** Panel id owned by a dashboard layout (`nav`, `sidebar`, `main`, `column`, …). */
  panel: DashboardPanelId | string;
  order?: number;
  component: ComponentType<SurfaceProps>;
};

export type UiProviderContribution = {
  id: string;
  order?: number;
  component: ComponentType<{ children: ReactNode }>;
};

export type UiHooks = {
  onReady?: () => void;
};

export type TargetRuntime = 'node' | 'react';

export type UiPlugin = {
  name: string;
  /** Agent-facing note: when to use this UI plugin and what it paints. */
  description?: string;
  /** Which runtime this plugin is built for. */
  targetRuntime?: TargetRuntime;
  hooks?: UiHooks;
  implementation?: {
    surfaces?: UiSurface[];
    providers?: UiProviderContribution[];
    /** Last plugin that sets a layout wins. Constrained to known shells. */
    layout?: DashboardLayoutId;
  };
};
