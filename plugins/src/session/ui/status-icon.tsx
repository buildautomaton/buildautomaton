import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

export function ToolStatusIcon({ status }: { status: string }) {
  if (status === 'done' || status === 'completed') {
    return <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-500" aria-label="Done" />;
  }
  if (status === 'in_progress') {
    return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" aria-label="In progress" />;
  }
  if (status === 'failed' || status === 'cancelled') {
    return <XCircle className="h-3 w-3 text-destructive" aria-label={status} />;
  }
  return null;
}
