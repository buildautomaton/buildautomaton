import { X } from 'lucide-react';
import { Button } from '@buildautomaton/ui-runtime';

export function WidgetClose() {
  if (typeof window === 'undefined' || window.parent === window) return null;
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label="Close"
      className="h-8 w-8 shrink-0 text-muted-foreground"
      onClick={() => window.parent.postMessage({ source: 'buildautomaton', type: 'close' }, '*')}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
