import type { Listing, ListingFile, ListingKind, ListingSummary, PublishListingInput } from './listing.js';

export type ListingPatch = Partial<Omit<PublishListingInput, 'slug'>>;

export type MarketplaceImplementation = {
  list(kind?: ListingKind): Promise<ListingSummary[]>;
  search(query: string, kind?: ListingKind): Promise<ListingSummary[]>;
  get(idOrSlug: string): Promise<Listing | null>;
  source(idOrSlug: string, filePath?: string): Promise<ListingFile[] | ListingFile | null>;
  publish(input: PublishListingInput): Promise<Listing>;
  update(idOrSlug: string, patch: ListingPatch): Promise<Listing | null>;
  remove(idOrSlug: string): Promise<boolean>;
};
