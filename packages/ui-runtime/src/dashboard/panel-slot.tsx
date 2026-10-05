import { useUiHost } from './host.js';
import { cn } from '../design/cn.js';

export function PanelSlot({
  panel,
  className,
  id,
}: {
  panel: string;
  className?: string;
  id?: string;
}) {
  const { surfacesIn } = useUiHost();
  const surfaces = surfacesIn(panel);
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
