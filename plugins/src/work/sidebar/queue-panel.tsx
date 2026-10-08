import { useWork } from '../board/context.js';
import { sameProject } from '../board/project-name.js';
import { summarizeQueue } from './queue-summary.js';

export function QueuePanel() {
  const { items, project } = useWork();
  const summary = summarizeQueue(items.filter((item) => sameProject(item.project, project)));
  const shown = summary.waiting.slice(0, 3);
  const more = summary.waiting.length - shown.length;
  return (
    <footer className="shrink-0 border-t border-border bg-muted/40 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Queue</p>
      {summary.count === 0 ? <p className="mt-1 text-sm text-muted-foreground">Nothing queued</p> : null}
      {summary.building ? <p className="mt-1 truncate text-sm font-medium">Building {summary.building}</p> : null}
      {summary.waiting.length > 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">{summary.waiting.length === 1 ? '1 queued' : `${summary.waiting.length} queued`}</p>
      ) : null}
      {shown.length > 0 ? (
        <ul className="mt-1 space-y-0.5">
          {shown.map((title, index) => (
            <li key={`${index}:${title}`} className="truncate text-sm">
              {title}
            </li>
          ))}
        </ul>
      ) : null}
      {more > 0 ? <p className="mt-1 text-xs text-muted-foreground">{more} more</p> : null}
    </footer>
  );
}
