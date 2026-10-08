import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { EmptyState } from '@buildautomaton/ui-runtime';
import { sessionPrompts } from '@plugins/session/transcript/prompts.js';
import { SessionTranscriptModal } from '@plugins/session/ui/transcript-modal.js';
import { useDiskSnapshot } from '@plugins/session/ui/use-snapshot.js';
import { useNow } from '@plugins/session/ui/use-now.js';
import { PromptRow } from './prompt-row.js';
import { SessionWork } from './session-work.js';

export function PromptList({ sessionId }: { sessionId: string | null }) {
  if (!sessionId) {
    return <EmptyState icon={MessageCircle} title="Nothing in progress" description="Send a prompt to start a session." />;
  }
  return <ActivePrompts sessionId={sessionId} />;
}

function ActivePrompts({ sessionId }: { sessionId: string }) {
  const { snapshot, error } = useDiskSnapshot(sessionId);
  const now = useNow();
  const [open, setOpen] = useState(false);
  const prompts = snapshot ? sessionPrompts(snapshot.session, snapshot.events) : [];
  if (error && prompts.length === 0) return <p className="p-4 text-sm text-destructive">{error}</p>;
  return (
    <>
      {prompts.length === 0 ? (
        <EmptyState icon={MessageCircle} title="Nothing in progress" description="Send a prompt to start a session." />
      ) : (
        <ul>
          {prompts.map((prompt) => (
            <li key={prompt.id} className="border-b border-border">
              <PromptRow prompt={prompt} now={now} onOpen={() => setOpen(true)} />
            </li>
          ))}
        </ul>
      )}
      <SessionWork sessionId={sessionId} />
      {open ? <SessionTranscriptModal id={sessionId} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
