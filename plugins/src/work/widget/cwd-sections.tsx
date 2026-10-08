import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Folder, FolderGit2, GitBranch } from 'lucide-react';
import type { GitContext } from '@plugins/git/types.js';

export function GitSections({
  git,
  note,
  page,
  warning,
}: {
  git: GitContext;
  note?: string;
  page: string | null;
  warning: string | null;
}) {
  const repoName = git.repo ? git.repo.split(/[/\\]/).pop() || git.repo : 'Not a git repository';
  return (
    <div className="flex flex-col gap-4">
      <PropSection icon={Folder} label="CWD">
        <p className="break-all font-mono text-[11px] leading-snug text-foreground">{git.cwd}</p>
        {note ? <p className="text-xs leading-relaxed text-muted-foreground">{note}</p> : null}
        {page ? <p className="break-all text-[11px] text-muted-foreground">This page: {page}</p> : null}
        {warning ? <p className="text-xs text-destructive">{warning}</p> : null}
      </PropSection>
      <PropSection icon={FolderGit2} label="Git repo">
        <p className="text-sm font-medium leading-snug">{repoName}</p>
        {git.repo ? (
          <p className="break-all font-mono text-[11px] leading-snug text-muted-foreground">{git.repo}</p>
        ) : null}
      </PropSection>
      <PropSection icon={GitBranch} label="Branch">
        <p className="text-sm font-medium leading-snug">{git.inRepo ? (git.branch ?? 'Detached') : 'None'}</p>
      </PropSection>
    </div>
  );
}

function PropSection({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/50 bg-muted/45 text-muted-foreground">
          <Icon className="h-3.5 w-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="text-[11px] font-semibold uppercase leading-none tracking-wide text-muted-foreground">{label}</h3>
          {children}
        </div>
      </div>
    </section>
  );
}
