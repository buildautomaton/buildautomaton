import type { CoordinatorSetup } from '../queue/http/setup-status.js';

export function CoordinatorLine({ coordinator }: { coordinator?: CoordinatorSetup }) {
  const text = label(coordinator);
  if (!text) return null;
  return <p className="truncate px-4 py-2 text-xs text-muted-foreground">{text}</p>;
}

function label(coordinator?: CoordinatorSetup): string | null {
  if (coordinator?.status === 'waiting') return 'Waiting for an installed agent.';
  if (coordinator?.status === 'failed') return coordinator.error ?? 'Session failed.';
  return null;
}
