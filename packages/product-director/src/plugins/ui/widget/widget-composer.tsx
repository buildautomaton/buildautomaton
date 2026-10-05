import { PromptComposer } from '@buildautomaton/ui-runtime';
import { useWork } from '../work/context.js';
import { titleFromPrompt } from '../work/draft-title.js';
import { pageFromLocation, promptWithPage } from './page-context.js';

export function WidgetComposer() {
  const { client, reload, project } = useWork();
  const page = pageFromLocation(window.location.search);
  return (
    <PromptComposer
      placeholder="Change something about this app…"
      onSubmit={async (content) => {
        await client.addWork({ title: titleFromPrompt(content), content: promptWithPage(content, page), project });
        await reload();
      }}
    />
  );
}
