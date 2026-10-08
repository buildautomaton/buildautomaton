import { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import type { SetupAgent } from '../queue/http/setup-status.js';
import { browserChoiceStore, resolveChoice, writeChoice, type PromptChoice } from './choice.js';
import { PromptMenu } from './menu.js';

export function PromptPickers({
  agents,
  checking,
  followUp,
  lockHarness,
  onChange,
}: {
  agents: SetupAgent[];
  checking: boolean;
  followUp?: boolean;
  lockHarness?: string;
  onChange: (choice: PromptChoice) => void;
}) {
  const [choice, setChoice] = useState<PromptChoice>({ harness: '', model: '' });
  const selected = agents.find((agent) => agent.type === (lockHarness || choice.harness));
  useEffect(() => {
    const next = resolveChoice(browserChoiceStore(), agents, lockHarness);
    setChoice(next);
    onChange(next);
  }, [agents, lockHarness, onChange]);

  function commit(next: PromptChoice) {
    writeChoice(browserChoiceStore(), next);
    setChoice(next);
    onChange(next);
  }

  const ordered = [...agents].sort((a, b) => Number(b.detected) - Number(a.detected));
  const modelLabel = selected?.models.find((item) => item.id === choice.model)?.label ?? (choice.model || 'Not set');
  return (
    <>
      {followUp ? (
        <LockedAgent label={selected?.displayName ?? lockHarness ?? 'Agent'} />
      ) : (
        <PromptMenu
          icon="agent"
          label={checking ? 'Checking' : (selected?.displayName ?? 'Agent')}
          disabled={checking || ordered.length === 0}
          pending={checking}
          items={ordered.map((agent) => ({
            id: agent.type,
            label: agent.displayName,
            detected: agent.detected,
            selected: agent.type === choice.harness,
            disabled: !agent.detected,
          }))}
          onPick={(harness) => {
            const models = agents.find((agent) => agent.type === harness)?.models ?? [];
            const model = models.some((item) => item.id === choice.model) ? choice.model : '';
            commit({ harness, model });
          }}
        />
      )}
      <PromptMenu
        icon="model"
        label={modelLabel}
        disabled={!selected}
        pending={Boolean(selected?.modelsPending)}
        items={[
          { id: '', label: 'Not set', selected: choice.model === '' },
          ...((selected?.models ?? []).map((item) => ({
            id: item.id,
            label: item.label,
            selected: item.id === choice.model,
          }))),
        ]}
        onPick={(model) => commit({ harness: lockHarness || choice.harness, model })}
      />
    </>
  );
}

function LockedAgent({ label }: { label: string }) {
  return (
    <span className="flex h-auto max-w-[min(100%,12rem)] items-center gap-1 px-1.5 py-1 text-xs text-foreground">
      <Bot className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
      <span className="min-w-0 truncate">{label}</span>
    </span>
  );
}
