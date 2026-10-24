import type { BuildAutomatonSetup } from '../queue/http/setup-status.js';
import { AgentRow } from './agent-row.js';

export function AgentSetup({
  agents,
  onChanged,
}: {
  agents: BuildAutomatonSetup['agents'];
  onChanged: () => Promise<void>;
}) {
  const detected = agents.filter((agent) => agent.detected);
  const installable = agents.filter((agent) => !agent.detected && agent.canInstall);
  return (
    <div className="space-y-6 px-4 py-4">
      <AgentGroup title="Detected" agents={detected} empty="No agents detected yet." onChanged={onChanged} />
      <AgentGroup title="Install" agents={installable} empty="Nothing else can be installed from here." onChanged={onChanged} />
    </div>
  );
}

function AgentGroup({
  title,
  agents,
  empty,
  onChanged,
}: {
  title: string;
  agents: BuildAutomatonSetup['agents'];
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
