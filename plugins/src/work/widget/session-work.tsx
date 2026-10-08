import { useState } from 'react';
import { artifactTabLabel, previewArtifactFiles } from '../board/preview-files.js';
import { WorkCardThumbPreview } from '../board/work-card-thumb-preview.js';
import { useWork } from '../board/context.js';
import { ArtifactModal } from './artifact-modal.js';
import { artifactsForSession } from './session-artifacts.js';

export function SessionWork({ sessionId }: { sessionId: string }) {
  const { artifacts } = useWork();
  const mine = artifactsForSession(artifacts, sessionId);
  const [open, setOpen] = useState(false);
  const latest = mine[mine.length - 1];
  if (!latest) return null;
  const thumbs = previewArtifactFiles(latest.files).slice(0, 2);
  return (
    <>
      <button
        type="button"
        className="block w-full border-t border-border px-4 py-3 text-left hover:bg-muted/40"
        onClick={() => setOpen(true)}
      >
        <p className="truncate text-sm font-medium">{latest.title.trim() || 'Completed work'}</p>
        {latest.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{latest.description}</p>
        ) : null}
        {thumbs.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {thumbs.map((file) => (
              <WorkCardThumbPreview
                key={file.path}
                path={file.path}
                content={file.content}
                label={artifactTabLabel(file.path)}
                className="h-24 rounded-lg"
              />
            ))}
          </div>
        ) : null}
      </button>
      {open ? <ArtifactModal artifacts={mine} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
