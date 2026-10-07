import { Bot } from 'lucide-react';
import { ColumnHeader } from '@buildautomaton/ui-runtime';
import type { DirectorSetup } from '../../runtime/work/http/setup-status.js';
import { AgentRow } from './agent-row.js';
import { CwdBlock } from './cwd-block.js';
import { WidgetClose } from './widget-close.js';

export function SetupView({ setup, onChanged }: { setup: DirectorSetup; onChanged: () => Promise<void> }) {
  const detected = setup.agents.filter((agent) => agent.detected);
  const installable = setup.agents.filter((agent) => !agent.detected && agent.canInstall);
  return (
    <section className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <ColumnHeader title="Set up an agent" icon={Bot} trailing={<WidgetClose />} />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4">
        <CwdBlock cwd={setup.cwd} appNote={setup.appNote} />
        <AgentGroup title="Detected" agents={detected} empty="No agents detected yet." onChanged={onChanged} />
        <AgentGroup title="Install" agents={installable} empty="Nothing else can be installed from here." onChanged={onChanged} />
      </div>
    </section>
  );
}

function AgentGroup({
  title,
  agents,
  empty,
  onChanged,
}: {
  title: string;
  agents: DirectorSetup['agents'];
  empty: string;
  onChanged: () => Promise<void>;
}) {
  return (
    <section>
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</h2>
      {agents.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">{empty}</p> : null}
      <ul>
        {agents.map((agent) => (
          <AgentRow key={agent.type} agent={agent} onChanged={onChanged} />
        ))}
      </ul>
    </section>
  );
}
