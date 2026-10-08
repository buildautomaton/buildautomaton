import { Bot, Loader2 } from 'lucide-react';
import { ColumnHeader } from '@buildautomaton/ui-runtime';
import { SessionList } from '@plugins/session/ui/session-list.js';
import type { BuildAutomatonSetup } from '../queue/http/setup-status.js';
import { CoordinatorLine } from './coordinator-line.js';
import { CwdPopup } from './cwd-popup.js';
import { AgentSetup } from './setup-view.js';
import { SessionWork } from './session-work.js';
import { WidgetClose } from './widget-close.js';
import { WidgetComposer } from './widget-composer.js';

const NO_AGENTS: BuildAutomatonSetup['agents'] = [];

export function WorkColumn({
  setup,
  checking,
  error,
  reload,
}: {
  setup: BuildAutomatonSetup | null;
  checking: boolean;
  error: string | null;
  reload: () => Promise<void>;
}) {
  const agents = setup?.agents ?? NO_AGENTS;
  const showSetup = Boolean(setup && !setup.ready);
  return (
    <section className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <ColumnHeader
        title="BuildAutomaton"
        icon={Bot}
        trailing={
          <span className="flex items-center gap-1">
            <CwdPopup note={setup?.appNote} />
            <WidgetClose />
          </span>
        }
      />
      {checking ? (
        <p className="flex items-center gap-2 border-b border-border px-4 py-1.5 text-xs text-muted-foreground" role="status">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          Checking agents
        </p>
      ) : null}
      {error ? <p className="px-4 py-2 text-sm text-destructive">{error}</p> : null}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {showSetup ? <AgentSetup agents={agents} onChanged={reload} /> : null}
        <CoordinatorLine coordinator={setup?.coordinator} />
        <SessionList
          include={(session) => session.status === 'running'}
          empty={showSetup ? null : { title: 'Nothing in progress', description: 'Send a prompt to start a session.' }}
          extra={(session) => <SessionWork sessionId={session.id} />}
        />
      </div>
      <WidgetComposer agents={agents} checking={checking} />
    </section>
  );
}
