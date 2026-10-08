import { LayoutGrid } from 'lucide-react';
import { cn, useUiHost, type UiPlugin } from '@buildautomaton/ui-runtime';

export function AppNav() {
  const { slots, selectedId, setSelectedId } = useUiHost();
  const mains = slots.surfaces.filter((surface) => surface.panel === 'main');
  const current = selectedId ?? mains[0]?.id;
  return (
    <nav className="flex h-full flex-col items-center gap-2 py-3">
      {mains.map((surface) => {
        const active = surface.id === current;
        return (
          <button
            key={surface.id}
            type="button"
            title={surface.title}
            onClick={() => setSelectedId(surface.id)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-md',
              active ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/60',
            )}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        );
      })}
    </nav>
  );
}

export function appNavPlugin(): UiPlugin {
  return {
    name: 'app-nav',
    description: 'Nav rail for switching main surfaces. Use in the app-host sidebar shell.',
    targetRuntime: 'react',
    implementation: {
      surfaces: [{ id: 'app-nav', title: 'Apps', panel: 'nav', order: 0, component: AppNav }],
    },
  };
}
