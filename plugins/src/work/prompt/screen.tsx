import { useEffect, useState } from 'react';
import { createHttpWorkClient } from '../board/http-client.js';
import { loadApp, transformApp, type AppState } from '../app/load-app.js';
import { PromptGate } from '../app/prompt-gate.js';
import { AppCanvas } from './canvas.js';
import { MorphOverlay } from './morph/overlay.js';

export function AppScreen() {
  const [state, setState] = useState<AppState | null>(null);
  const [morphing, setMorphing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApp()
      .then(setState)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not read the app'));
  }, []);

  async function onSubmit(prompt: string) {
    await createHttpWorkClient().startSession({ prompt });
    setState(await transformApp(prompt));
    setMorphing(true);
  }

  if (morphing && state?.phase === 'transformed') {
    return <MorphOverlay prompt={state.prompt ?? ''} onDone={() => setMorphing(false)} />;
  }
  if (!state || state.phase === 'prompt') {
    return (
      <div className="fixed inset-0 z-40 bg-background">
        {state ? <PromptGate onSubmit={onSubmit} /> : null}
        {error ? <p className="grid h-full place-items-center text-sm text-muted-foreground">{error}</p> : null}
      </div>
    );
  }
  return <AppCanvas prompt={state.prompt ?? ''} />;
}
