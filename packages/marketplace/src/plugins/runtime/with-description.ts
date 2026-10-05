import type { ArtifactInput, PublishListingInput } from '../../types/listing.js';

export function artifactsWithDescription(input: PublishListingInput): ArtifactInput[] {
  const artifacts = [...(input.artifacts ?? [])];
  const markdown = input.description?.trim();
  if (!markdown) return artifacts;
  const existing = artifacts.findIndex((artifact) => artifact.kind === 'description');
  const next: ArtifactInput = {
    kind: 'description',
    title: 'Description',
    files: [{ path: 'description.md', content: markdown }],
    payload: { markdown },
  };
  if (existing >= 0) artifacts[existing] = next;
  else artifacts.unshift(next);
  return artifacts;
}
