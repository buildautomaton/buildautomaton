import type { UiSurface } from '../core/plugin.js';

/** Main can host many apps. Show the selected one, or the first. */
export function surfacesForPanel(surfaces: UiSurface[], selectedId: string | null): UiSurface[] {
  if (surfaces.length <= 1) return surfaces;
  const match = selectedId ? surfaces.find((surface) => surface.id === selectedId) : undefined;
  return [match ?? surfaces[0]!];
}
