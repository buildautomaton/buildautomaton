import type { ListingArtifact, ListingFile } from '../../types/listing.js';

export function listingSearchText(input: {
  name: string;
  summary: string;
  kind: string;
  plugins: string[];
  artifacts: Pick<ListingArtifact, 'kind' | 'title' | 'files'>[];
  source: ListingFile[];
}): string {
  const artifactText = input.artifacts.flatMap((artifact) => [
    artifact.kind,
    artifact.title,
    ...artifact.files.map((file) => file.content),
  ]);
  const sourceText = input.source.map((file) => `${file.path}\n${file.content}`);
  return [input.kind, input.name, input.summary, input.plugins.join(' '), ...artifactText, ...sourceText].join('\n');
}

export function descriptionMarkdown(artifacts: ListingArtifact[], fallback: string): string {
  const found = artifacts.find((artifact) => artifact.kind === 'description');
  return found?.files[0]?.content ?? fallback;
}
