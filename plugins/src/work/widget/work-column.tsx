import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useDiskSessions } from '@plugins/session/ui/use-sessions.js';
import type { BuildAutomatonSetup } from '../queue/http/setup-status.js';
import { CoordinatorLine } from './coordinator-line.js';
import { AgentSetup } from './setup-view.js';
import { WidgetClose } from './widget-close.js';
import { WidgetComposer } from './widget-composer.js';
import { PromptList } from './prompt-list.js';
import { SessionHeader } from './session-header.js';
import { LiveStatus } from './live-status.js';
import { sessionIsRunning } from './active-running.js';
import { useLive } from '@plugins/live/ui/context.js';
import { readActiveChat, writeActiveChat } from './active-chat.js';

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
  const { sessions } = useDiskSessions(true);
  const { sessions: live } = useLive();
  const [chat, setChat] = useState<string | null>(readActiveChat);
  const sessionId = chat === '' ? null : (chat ?? sessions[0]?.id ?? null);
  const selected = sessions.find((session) => session.id === sessionId);
  const running = sessionIsRunning(sessionId, live) || selected?.status === 'running';

  function selectChat(id: string) {
    writeActiveChat(id);
    setChat(id);
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center gap-1 border-b border-border px-3">
        <SessionHeader sessionId={sessionId} sessions={sessions} note={setup?.appNote} onChange={selectChat} />
        <LiveStatus running={running} />
        <WidgetClose />
      </header>
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
        <PromptList sessionId={sessionId} />
      </div>
      <WidgetComposer
        agents={agents}
        checking={checking}
        sessionId={sessionId}
        lockHarness={sessionId ? selected?.harness : undefined}
        onSession={selectChat}
      />
    </section>
  );
}
