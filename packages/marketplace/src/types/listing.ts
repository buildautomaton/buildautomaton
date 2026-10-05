export type ListingKind = 'plugin' | 'app';

export type ListingFile = {
  path: string;
  content: string;
};

export type ListingArtifact = {
  id: string;
  kind: string;
  title: string;
  files: ListingFile[];
  payload: Record<string, unknown>;
};

export type ListingSummary = {
  id: string;
  kind: ListingKind;
  slug: string;
  name: string;
  summary: string;
  version: string;
  author: string;
  plugins: string[];
  createdAt: string;
  score?: number;
};

export type Listing = ListingSummary & {
  artifacts: ListingArtifact[];
  source: ListingFile[];
};

export type ArtifactInput = {
  kind: string;
  title?: string;
  files?: ListingFile[];
  payload?: Record<string, unknown>;
};

export type PublishListingInput = {
  kind: ListingKind;
  slug: string;
  name: string;
  summary?: string;
  description?: string;
  version?: string;
  author?: string;
  plugins?: string[];
  artifacts?: ArtifactInput[];
  source?: ListingFile[];
};
