import { Focus } from 'lucide-react';
import { Button } from '../design/button.js';
import { useUiHost } from './host.js';

export function ColumnFocusButton({ columnId }: { columnId: string }) {
  const { focusedColumnId, setFocusedColumnId } = useUiHost();
  const active = focusedColumnId === columnId;
  const label = active ? 'Exit focus' : 'Focus column';

  return (
    <Button
      type="button"
      size="icon"
      variant={active ? 'secondary' : 'ghost'}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className="h-8 w-8 shrink-0 text-muted-foreground"
      onClick={() => setFocusedColumnId(active ? null : columnId)}
    >
      <Focus className="h-4 w-4" />
    </Button>
  );
}
