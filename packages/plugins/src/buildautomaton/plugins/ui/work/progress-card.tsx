import { SentTime } from './sent-time.js';
import { AssignProjectButton } from './assign-project-button.js';
import type { WorkItem } from './types.js';

export function ProgressCard({ item }: { item: WorkItem }) {
  const title = item.title.trim() || 'In progress';
  const body = item.content.trim();
  const showBody = Boolean(body) && body !== title;
  return (
    <article className="bg-background">
      <div className="space-y-2 px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 truncate text-sm font-semibold leading-snug">{title}</p>
            <SentTime at={item.createdAt} />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">In progress</p>
            <AssignProjectButton workId={item.id} project={item.project} />
          </div>
        </div>
        {showBody ? <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{body}</p> : null}
      </div>
    </article>
  );
}
