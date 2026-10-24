import { LiveProvider } from '@plugins/live/ui/context.js';
import { useSetup } from './use-setup.js';
import { WorkColumn } from './work-column.js';

export function WidgetShell() {
  const { setup, error, checking, reload } = useSetup();
  return (
    <LiveProvider>
      <WorkColumn setup={setup} checking={checking} error={error} reload={reload} />
    </LiveProvider>
  );
}
