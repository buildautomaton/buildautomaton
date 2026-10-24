import { useState } from 'react';
import { PromptComposer } from '@buildautomaton/ui-runtime';
import type { SetupAgent } from '../queue/http/setup-status.js';
import type { PromptChoice } from '../prompt/choice.js';
import { PromptPickers } from '../prompt/pickers.js';
import { useWork } from '../board/context.js';
import { pageFromLocation, promptWithPage } from './page-context.js';

export function WidgetComposer({
  agents,
  checking,
  sessionId,
  lockHarness,
  onSession,
}: {
  agents: SetupAgent[];
  checking: boolean;
  sessionId: string | null;
  lockHarness?: string;
  onSession: (id: string) => void;
}) {
  const { client, reload, project } = useWork();
  const page = pageFromLocation(typeof window === 'undefined' ? '' : window.location.search);
  const [choice, setChoice] = useState<PromptChoice>({ harness: '', model: '' });
  return (
    <PromptComposer
      placeholder={sessionId ? 'Send a follow-up…' : 'Describe a change to this app…'}
      placement="bottom"
      leading={
        <PromptPickers
          agents={agents}
          checking={checking}
          followUp={Boolean(sessionId)}
          lockHarness={lockHarness}
          onChange={setChoice}
        />
      }
      onSubmit={async (content) => {
        const started = await client.startSession({
          prompt: promptWithPage(content, page),
          project,
          harness: sessionId ? undefined : choice.harness || undefined,
          model: choice.model || undefined,
          sessionId: sessionId || undefined,
        });
        const next = started.sessionId ?? started.sessionIds[0];
        if (next) onSession(next);
        await reload();
      }}
    />
  );
}
