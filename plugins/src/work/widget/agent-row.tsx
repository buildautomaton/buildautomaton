import { useState } from 'react';
import { Button, Input } from '@buildautomaton/ui-runtime';
import type { SetupAgent } from '../queue/http/setup-status.js';
import { installAgent } from './load-setup.js';

export function AgentRow({ agent, onChanged }: { agent: SetupAgent; onChanged: () => Promise<void> }) {
  const [token, setToken] = useState('');
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function install(nextToken: string) {
    setBusy(true);
    setError(null);
    try {
      await installAgent(agent.type, nextToken);
      setAsking(false);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Install failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="space-y-2 border-b border-border py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{agent.displayName}</p>
        {agent.detected ? <span className="text-xs text-muted-foreground">Detected</span> : null}
        {!agent.detected && agent.canInstall ? (
          <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => (agent.authEnvVar ? setAsking(true) : void install(''))}>
            {busy ? 'Installing…' : 'Install'}
          </Button>
        ) : null}
      </div>
      {asking ? (
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void install(token);
          }}
        >
          <Input type="password" value={token} placeholder={agent.authEnvVar ?? 'Token'} onChange={(event) => setToken(event.target.value)} />
          <Button type="submit" size="sm" disabled={busy || !token.trim()}>
            Install
          </Button>
        </form>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </li>
  );
}
