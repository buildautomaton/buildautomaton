import { Badge } from '@buildautomaton/ui-runtime';
import type { ListingSummary } from '../../types/listing.js';

export function ListingCard(props: { listing: ListingSummary; onOpen: (id: string) => void }) {
  const listing = props.listing;
  return (
    <button
      type="button"
      onClick={() => props.onOpen(listing.id)}
      className="w-full px-4 py-3 text-left hover:bg-accent/40"
    >
      <div className="flex items-center gap-2">
        <p className="truncate text-sm font-medium">{listing.name}</p>
        <Badge>{listing.kind}</Badge>
        {listing.score !== undefined ? <Badge>{listing.score.toFixed(2)}</Badge> : null}
      </div>
      <p className="truncate text-xs text-muted-foreground">{listing.summary}</p>
      {listing.plugins.length > 0 ? (
        <p className="truncate text-xs text-muted-foreground">plugins: {listing.plugins.join(', ')}</p>
      ) : null}
    </button>
  );
}
