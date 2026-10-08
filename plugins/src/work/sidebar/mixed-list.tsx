import { Inbox } from 'lucide-react';
import { EmptyState } from '@buildautomaton/ui-runtime';
import { DraftCard } from '../board/draft-card.js';
import { FeedThread } from '../board/feed-thread.js';
import { ProgressCard } from '../board/progress-card.js';
import { useWork } from '../board/context.js';
import { workListClass } from '../board/work-list-class.js';
import { mixedFeed } from './mixed-feed.js';

export function MixedList() {
  const { artifacts, items, project } = useWork();
  const entries = mixedFeed(items, artifacts, project);
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No work yet"
        description="Describe a change. In-progress tasks appear here until the agent reports what was built."
      />
    );
  }
  return (
    <ul className={workListClass}>
      {entries.map((entry) => (
        <li key={entry.id}>
          {entry.kind === 'draft' ? (
            <DraftCard item={entry.item} />
          ) : entry.kind === 'progress' ? (
            <ProgressCard item={entry.item} />
          ) : (
            <FeedThread artifacts={entry.thread.artifacts} />
          )}
        </li>
      ))}
    </ul>
  );
}
