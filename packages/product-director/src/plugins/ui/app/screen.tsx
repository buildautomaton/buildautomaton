import { useEffect, useState } from 'react';
import { titleFromPrompt } from '../work/draft-title.js';
import { createHttpWorkClient } from '../work/http-client.js';
import { loadApp, transformApp, type AppState } from '../../../app/load-app.js';
import { PromptGate } from '../../../app/prompt-gate.js';
import { AppCanvas } from './canvas.js';

export function AppScreen() {
  const [state, setState] = useState<AppState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApp()
      .then(setState)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not read the app'));
  }, []);

  async function onSubmit(prompt: string) {
    const next = await transformApp(prompt);
    await createHttpWorkClient()
      .addWork({ title: titleFromPrompt(prompt), content: prompt })
      .catch(() => undefined);
    setState(next);
  }

  if (!state) {
    return (
      <p className="grid h-full place-items-center text-sm text-muted-foreground">{error ?? 'Starting…'}</p>
    );
  }
  if (state.phase === 'prompt') return <PromptGate onSubmit={onSubmit} />;
  return <AppCanvas prompt={state.prompt ?? ''} />;
}
