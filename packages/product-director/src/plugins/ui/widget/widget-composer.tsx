import { PromptComposer } from '@buildautomaton/ui-runtime';
import { useWork } from '../work/context.js';
import { pageFromLocation, promptWithPage } from './page-context.js';

export function WidgetComposer() {
  const { client, reload, project } = useWork();
  const page = pageFromLocation(window.location.search);
  return (
    <PromptComposer
      placeholder="Describe a change to this app…"
      onSubmit={async (content) => {
        await client.startSession({ prompt: promptWithPage(content, page), project });
        await reload();
      }}
    />
  );
}
