import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button, ColumnHeader } from '@buildautomaton/ui-runtime';
import { WorkCard } from '../board/work-card.js';
import type { WorkArtifact } from '../board/types.js';

export function ArtifactModal({ artifacts, onClose }: { artifacts: WorkArtifact[]; onClose: () => void }) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  if (typeof document === 'undefined' || artifacts.length === 0) return null;
  const title = artifacts[artifacts.length - 1]?.title.trim() || 'Completed work';
  return createPortal(
    <div data-ba-overlay className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex h-[min(40rem,90vh)] w-[min(48rem,100%)] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ColumnHeader
          title={title}
          trailing={
            <Button type="button" size="icon" variant="ghost" aria-label="Close completed work" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          }
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          {artifacts.map((artifact) => (
            <WorkCard key={artifact.id} artifact={artifact} />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
