import { applyEvent } from './apply-event.js';
import { emptyDraft, flushText, flushThought, type TranscriptEvent, type TranscriptViewBlock } from './block.js';
import { userRequestText } from './user-request.js';

export type { TranscriptEvent, TranscriptViewBlock } from './block.js';
export { sessionTitle, userRequestText } from './user-request.js';

export function transcriptBlocks(
  session: { prompt: string; error?: string },
  events: TranscriptEvent[],
): TranscriptViewBlock[] {
  const draft = emptyDraft();
  const request = userRequestText(session.prompt);
  if (request) draft.blocks.push({ kind: 'user', text: request });
  for (const event of events) applyEvent(draft, event, request);
  flushText(draft);
  flushThought(draft);
  if (!draft.sawText && draft.resultText) draft.blocks.push({ kind: 'text', text: draft.resultText });
  if (session.error && !draft.blocks.some((block) => block.kind === 'error')) {
    draft.blocks.push({ kind: 'error', text: session.error });
  }
  return draft.blocks;
}
