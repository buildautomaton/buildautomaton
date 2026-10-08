import { ActivityCollapse } from './activity-collapse.js';
import { ToolStatusIcon } from './status-icon.js';
import { ThoughtBlock, ToolCallBlock } from './activity-blocks.js';
import type { TranscriptActivityItem } from '@plugins/session/transcript/block.js';

export function ActivityGroup({
  title,
  items,
  liveTail,
}: {
  title: string;
  items: TranscriptActivityItem[];
  liveTail: boolean;
}) {
  const running = items.some((item) => item.kind === 'tool' && /progress|pending/i.test(item.status));
  const last = items[items.length - 1];
  return (
    <ActivityCollapse title={title} trailing={<ToolStatusIcon status={running ? 'in_progress' : 'completed'} />} defaultOpen={running}>
      {items.map((item, index) => (
        <ActivityItemView
          key={item.kind === 'thought' ? `thought-${index}` : item.key}
          item={item}
          liveTail={liveTail && item === last}
        />
      ))}
    </ActivityCollapse>
  );
}

function ActivityItemView({ item, liveTail }: { item: TranscriptActivityItem; liveTail: boolean }) {
  if (item.kind === 'thought') return <ThoughtBlock text={item.text} liveTail={liveTail} />;
  if (item.kind === 'permission') return <ToolCallBlock title={item.title} status={item.status} detail={item.detail} />;
  return <ToolCallBlock title={item.title} status={item.status} detail={item.detail} />;
}
