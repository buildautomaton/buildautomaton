import { Bot } from 'lucide-react';
import { ColumnHeader } from '@buildautomaton/ui-runtime';
import type { CoordinatorSetup } from '../queue/http/setup-status.js';
import { CoordinatorLine } from './coordinator-line.js';
import { SessionList } from '@plugins/session/ui/session-list.js';
import { SessionWork } from './session-work.js';
import { QueuePanel } from './queue-panel.js';
import { WidgetClose } from './widget-close.js';
import { WidgetComposer } from './widget-composer.js';

export function WorkColumn({ cwd, coordinator }: { cwd: string; coordinator?: CoordinatorSetup }) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <ColumnHeader title="BuildAutomaton" icon={Bot} trailing={<WidgetClose />} />
      <p className="truncate border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground" title={cwd}>
        {cwd}
      </p>
      <CoordinatorLine coordinator={coordinator} />
      <WidgetComposer />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <SessionList extra={(session) => <SessionWork sessionId={session.id} />} />
      </div>
      <QueuePanel />
    </section>
  );
}
