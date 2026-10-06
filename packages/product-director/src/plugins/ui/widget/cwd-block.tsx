import { pageFromLocation } from './page-context.js';
import { pageHostWarning } from './page-host.js';

export function CwdBlock({ cwd, appNote }: { cwd: string; appNote: string }) {
  const page = pageFromLocation(typeof window === 'undefined' ? '' : window.location.search);
  const warning = pageHostWarning(page);
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Working directory</p>
      <p className="break-all font-mono text-sm" title={cwd}>
        {cwd}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">{appNote}</p>
      {page ? <p className="break-all text-xs text-muted-foreground">This page: {page}</p> : null}
      {warning ? <p className="text-sm text-destructive">{warning}</p> : null}
    </div>
  );
}
