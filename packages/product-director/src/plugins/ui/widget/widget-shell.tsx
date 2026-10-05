import { SetupView } from './setup-view.js';
import { useSetup } from './use-setup.js';
import { WorkColumn } from './work-column.js';

export function WidgetShell() {
  const { setup, error, reload } = useSetup();
  if (!setup) {
    return (
      <p className="p-4 text-sm text-muted-foreground">{error ?? 'Checking agents…'}</p>
    );
  }
  if (!setup.ready) return <SetupView setup={setup} onChanged={reload} />;
  return <WorkColumn cwd={setup.cwd} />;
}
