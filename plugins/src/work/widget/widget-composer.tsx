import { useState } from 'react';
import { PromptComposer } from '@buildautomaton/ui-runtime';
import type { SetupAgent } from '../queue/http/setup-status.js';
import type { PromptChoice } from '../prompt/choice.js';
import { PromptPickers } from '../prompt/pickers.js';
import { useWork } from '../board/context.js';
import { pageFromLocation, promptWithPage } from './page-context.js';

export function WidgetComposer({ agents, checking }: { agents: SetupAgent[]; checking: boolean }) {
  const { client, reload, project } = useWork();
  const page = pageFromLocation(typeof window === 'undefined' ? '' : window.location.search);
  const [choice, setChoice] = useState<PromptChoice>({ harness: '', model: '' });
  return (
    <PromptComposer
      placeholder="Describe a change to this app…"
      placement="bottom"
      leading={<PromptPickers agents={agents} checking={checking} onChange={setChoice} />}
      onSubmit={async (content) => {
        await client.startSession({
          prompt: promptWithPage(content, page),
          project,
          harness: choice.harness || undefined,
          model: choice.model || undefined,
        });
        await reload();
      }}
    />
  );
}
