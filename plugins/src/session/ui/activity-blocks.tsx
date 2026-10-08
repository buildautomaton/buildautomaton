import { ActivityCollapse } from './activity-collapse.js';
import { MarkdownBody } from './markdown-body.js';
import { ToolStatusIcon } from './status-icon.js';

export function ToolCallBlock({ title, status, detail }: { title: string; status: string; detail: string }) {
  return (
    <ActivityCollapse title={title} trailing={<ToolStatusIcon status={status} />}>
      {detail ? <pre className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">{detail}</pre> : null}
    </ActivityCollapse>
  );
}

export function ThoughtBlock({ text, liveTail }: { text: string; liveTail: boolean }) {
  if (liveTail) {
    return (
      <div className="my-3" aria-live="polite">
        <div className="mb-1 text-sm font-medium text-muted-foreground">Reasoning</div>
        <div className="text-sm text-muted-foreground">
          <MarkdownBody content={text} liveTail />
        </div>
      </div>
    );
  }
  return (
    <ActivityCollapse title="Reasoning">
      <div className="text-sm text-muted-foreground">
        <MarkdownBody content={text} />
      </div>
    </ActivityCollapse>
  );
}
