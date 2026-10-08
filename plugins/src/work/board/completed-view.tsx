import { CheckCircle2 } from 'lucide-react';
import { Column, ColumnFocusButton } from '@buildautomaton/ui-runtime';
import { WorkFeedList } from './feed-list.js';

export function CompletedView() {
  return (
    <Column
      title="Completed"
      icon={CheckCircle2}
      trailing={<ColumnFocusButton columnId="work-completed" />}
    >
      <WorkFeedList />
    </Column>
  );
}
