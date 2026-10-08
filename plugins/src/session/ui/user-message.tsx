import { User } from 'lucide-react';
import { MarkdownBody } from './markdown-body.js';

export function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 pb-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-muted-foreground"
        aria-hidden
      >
        <User className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 rounded-lg border border-border/80 bg-muted/40 px-3 py-2 text-sm text-foreground">
        <MarkdownBody content={text} />
      </div>
    </div>
  );
}
