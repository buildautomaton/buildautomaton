import { useEffect, useState } from 'react';
import { createHttpWorkClient } from '../board/http-client.js';
import { loadApp, transformApp, type AppState } from '../app/load-app.js';
import { PromptGate } from '../app/prompt-gate.js';
import type { SetupAgent } from '../queue/http/setup-status.js';
import { useSetup } from '../widget/use-setup.js';
import { AppCanvas } from './canvas.js';
import { MorphOverlay } from './morph/overlay.js';

const NO_AGENTS: SetupAgent[] = [];

export function AppScreen() {
  const agents = useSetup();
  const [state, setState] = useState<AppState | null>(null);
  const [morphing, setMorphing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApp()
      .then(setState)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not read the app'));
  }, []);

  async function onSubmit(input: { prompt: string; harness?: string; model?: string }) {
    await createHttpWorkClient().startSession(input);
    setState(await transformApp(input.prompt));
    setMorphing(true);
  }

  if (morphing && state?.phase === 'transformed') {
    return <MorphOverlay prompt={state.prompt ?? ''} onDone={() => setMorphing(false)} />;
  }
  if (!state || state.phase === 'prompt') {
    return (
      <div className="fixed inset-0 z-40 bg-background">
        {state ? (
          <PromptGate
            onSubmit={onSubmit}
            agents={agents.setup?.agents ?? NO_AGENTS}
            checking={agents.checking}
          />
        ) : null}
        {error ? <p className="grid h-full place-items-center text-sm text-muted-foreground">{error}</p> : null}
      </div>
    );
  }
  return <AppCanvas prompt={state.prompt ?? ''} />;
}
