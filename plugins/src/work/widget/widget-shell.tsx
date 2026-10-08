import { useSetup } from './use-setup.js';
import { WorkColumn } from './work-column.js';

export function WidgetShell() {
  const { setup, error, checking, reload } = useSetup();
  return <WorkColumn setup={setup} checking={checking} error={error} reload={reload} />;
}
