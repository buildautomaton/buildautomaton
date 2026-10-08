import { FileText } from 'lucide-react';

export function FilesBlock({ paths }: { paths: string[] }) {
  return (
    <div className="my-3 rounded-md border border-border/70 px-3 py-2">
      <p className="text-xs font-medium text-muted-foreground">{paths.length === 1 ? '1 file' : `${paths.length} files`}</p>
      <ul className="mt-1 space-y-0.5">
        {paths.map((path) => (
          <li key={path} className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <FileText className="h-3 w-3 shrink-0" aria-hidden />
            <span className="min-w-0 truncate">{path}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
