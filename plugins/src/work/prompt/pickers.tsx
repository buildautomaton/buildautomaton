import { useEffect, useState } from 'react';
import type { SetupAgent } from '../queue/http/setup-status.js';
import { browserChoiceStore, resolveChoice, writeChoice, type PromptChoice } from './choice.js';
import { PromptMenu } from './menu.js';

export function PromptPickers({
  agents,
  checking,
  onChange,
}: {
  agents: SetupAgent[];
  checking: boolean;
  onChange: (choice: PromptChoice) => void;
}) {
  const [choice, setChoice] = useState<PromptChoice>({ harness: '', model: '' });
  const selected = agents.find((agent) => agent.type === choice.harness);
  useEffect(() => {
    const next = resolveChoice(browserChoiceStore(), agents);
    setChoice(next);
    onChange(next);
  }, [agents, onChange]);

  function commit(next: PromptChoice) {
    writeChoice(browserChoiceStore(), next);
    setChoice(next);
    onChange(next);
  }

  const ordered = [...agents].sort((a, b) => Number(b.detected) - Number(a.detected));
  const modelLabel = selected?.models.find((item) => item.id === choice.model)?.label ?? (choice.model || 'Not set');
  return (
    <>
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
        onPick={(model) => commit({ harness: choice.harness, model })}
      />
    </>
  );
}
