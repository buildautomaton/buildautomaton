import type { Listing, ListingFile, ListingKind, ListingSummary, PublishListingInput } from './listing.js';

export type ListingPatch = Partial<Omit<PublishListingInput, 'slug'>>;

export type MarketplaceImplementation = {
  list(kind?: ListingKind): ListingSummary[];
  search(query: string, kind?: ListingKind): ListingSummary[];
  get(idOrSlug: string): Listing | null;
  source(idOrSlug: string, filePath?: string): ListingFile[] | ListingFile | null;
  publish(input: PublishListingInput): Listing;
  update(idOrSlug: string, patch: ListingPatch): Listing | null;
  remove(idOrSlug: string): boolean;
};
