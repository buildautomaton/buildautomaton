export function AppCanvas({ prompt }: { prompt: string }) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <header className="shrink-0 border-b border-border px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">App</p>
        <h1 className="mt-1 text-lg font-medium tracking-tight">{prompt}</h1>
      </header>
      <div className="min-h-0 flex-1 bg-muted/20" />
    </section>
  );
}
