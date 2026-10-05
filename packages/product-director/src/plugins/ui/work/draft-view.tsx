import { PenLine } from 'lucide-react';
import { Column, ColumnFocusButton } from '@buildautomaton/ui-runtime';
import { WorkComposer } from './composer.js';
import { DraftList } from './draft-list.js';

export function DraftView() {
  return (
    <Column
      title="Draft work"
      icon={PenLine}
      trailing={<ColumnFocusButton columnId="work-draft" />}
      toolbar={<WorkComposer />}
    >
      <DraftList />
    </Column>
  );
}
