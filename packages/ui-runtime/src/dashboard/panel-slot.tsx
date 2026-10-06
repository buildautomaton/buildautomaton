import { useUiHost } from './host.js';
import { cn } from '../design/cn.js';
import { surfacesForPanel } from './surfaces-for-panel.js';

export function PanelSlot({
  panel,
  className,
  id,
}: {
  panel: string;
  className?: string;
  id?: string;
}) {
  const { surfacesIn, selectedId } = useUiHost();
  const all = surfacesIn(panel);
  const surfaces = panel === 'main' ? surfacesForPanel(all, selectedId) : all;
  if (surfaces.length === 0) return null;
  return (
    <div id={id} className={cn('flex min-h-0 min-w-0 flex-col', className)}>
      {surfaces.map((surface) => {
        const View = surface.component;
        return <View key={surface.id} panel={panel} />;
      })}
    </div>
  );
}
