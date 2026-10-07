import type { ReactNode } from 'react';

export function Markdown({ text }: { text: string }) {
  return <div className="space-y-3 p-4 text-sm leading-relaxed">{parseBlocks(text).map(renderBlock)}</div>;
}

type Block = { key: string; node: ReactNode };

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let buffer: string[] = [];
  let inCode = false;
  lines.forEach((line, index) => {
    if (line.startsWith('```')) {
      if (inCode) {
        blocks.push({ key: `c${index}`, node: <pre className="overflow-auto rounded bg-muted p-3 text-xs">{buffer.join('\n')}</pre> });
        buffer = [];
        inCode = false;
      } else {
        flush(buffer, blocks, index);
        buffer = [];
        inCode = true;
      }
      return;
    }
    if (inCode) buffer.push(line);
    else if (!line.trim()) flush(buffer, blocks, index);
    else buffer.push(line);
  });
  if (inCode) blocks.push({ key: 'c-end', node: <pre className="overflow-auto rounded bg-muted p-3 text-xs">{buffer.join('\n')}</pre> });
  else flush(buffer, blocks, lines.length);
  return blocks;
}

function flush(buffer: string[], blocks: Block[], index: number): void {
  if (buffer.length === 0) return;
  const first = buffer[0] ?? '';
  const body = buffer.join('\n');
  buffer.length = 0;
  if (first.startsWith('# ')) blocks.push({ key: `h${index}`, node: <h2 className="text-lg font-semibold">{first.slice(2)}</h2> });
  else if (first.startsWith('## ')) blocks.push({ key: `h${index}`, node: <h3 className="text-base font-semibold">{first.slice(3)}</h3> });
  else if (first.startsWith('- ')) {
    blocks.push({
      key: `l${index}`,
      node: (
        <ul className="list-disc space-y-1 pl-5">
          {body.split('\n').map((item) => (
            <li key={item}>{item.replace(/^- /, '')}</li>
          ))}
        </ul>
      ),
    });
  } else blocks.push({ key: `p${index}`, node: <p>{body}</p> });
}

function renderBlock(block: Block) {
  return <div key={block.key}>{block.node}</div>;
}
