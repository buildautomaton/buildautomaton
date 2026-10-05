import { useState } from 'react';
import type { ListingFile } from '../../types/listing.js';

export function SourceTree({ files }: { files: ListingFile[] }) {
  const [path, setPath] = useState(files[0]?.path ?? '');
  const current = files.find((file) => file.path === path);
  if (files.length === 0) return <p className="p-4 text-sm text-muted-foreground">No source stored.</p>;
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[12rem_1fr]">
      <ul className="overflow-auto border-r border-border">
        {files.map((file) => (
          <li key={file.path}>
            <button
              type="button"
              onClick={() => setPath(file.path)}
              className={`w-full truncate px-3 py-2 text-left text-xs ${file.path === path ? 'bg-accent' : ''}`}
            >
              {file.path}
            </button>
          </li>
        ))}
      </ul>
      <pre className="overflow-auto p-3 text-xs">{current?.content}</pre>
    </div>
  );
}
