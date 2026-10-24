import { Loader2 } from 'lucide-react';
import { useLive } from '@plugins/live/ui/context.js';

export function LiveStatus({ running = false }: { running?: boolean }) {
  const { connected } = useLive();
  const label = connected ? (running ? 'Running' : 'Online') : 'Disconnected';
  return (
    <span
      role="status"
      aria-label={label}
      title={label}
      className="relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center"
    >
      {running && connected ? (
        <Loader2 className="absolute h-3.5 w-3.5 animate-spin text-emerald-500" aria-hidden />
      ) : null}
      <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`} />
    </span>
  );
}
