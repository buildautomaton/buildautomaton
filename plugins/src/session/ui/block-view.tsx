import type { TranscriptViewBlock } from '@plugins/session/transcript/blocks.js';
import { MarkdownBody } from './markdown-body.js';
import { ThoughtBlock, ToolCallBlock } from './activity-blocks.js';
import { ActivityGroup } from './activity-group.js';
import { FilesBlock } from './files-block.js';
import { UserMessage } from './user-message.js';

export function TranscriptBlockView({ block, liveTail }: { block: TranscriptViewBlock; liveTail: boolean }) {
  if (block.kind === 'user') return <UserMessage text={block.text} />;
  if (block.kind === 'text') return <MarkdownBody content={block.text} liveTail={liveTail} />;
  if (block.kind === 'thought') return <ThoughtBlock text={block.text} liveTail={liveTail} />;
  if (block.kind === 'tool' || block.kind === 'permission') {
    return <ToolCallBlock title={block.title} status={block.status} detail={block.detail} />;
  }
  if (block.kind === 'activity') return <ActivityGroup title={block.title} items={block.items} liveTail={liveTail} />;
  if (block.kind === 'files') return <FilesBlock paths={block.paths} />;
  if (block.kind === 'detail') return <ToolCallBlock title={block.title} status="completed" detail={block.detail} />;
  return <p className="text-sm text-destructive">{block.text}</p>;
}
