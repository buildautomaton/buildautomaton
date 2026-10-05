import { useCallback, useEffect, useState } from 'react';
import { Store } from 'lucide-react';
import { Column, EmptyState } from '@buildautomaton/ui-runtime';
import type { Listing, ListingKind, ListingSummary } from '../../types/listing.js';
import { createMarketplaceClient } from './client.js';
import { ListingCard } from './listing-card.js';
import { ListingDetail } from './detail.js';
import { SearchBar } from './search-bar.js';

export function MarketplaceCatalog() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<ListingKind | ''>('');
  const [items, setItems] = useState<ListingSummary[] | null>(null);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setItems(await createMarketplaceClient().list(kind || undefined, query || undefined));
  }, [kind, query]);

  useEffect(() => {
    reload().catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load marketplace'));
  }, [reload]);

  async function open(id: string) {
    setSelected(await createMarketplaceClient().get(id));
  }

  if (selected) return <ListingDetail listing={selected} onBack={() => setSelected(null)} />;

  return (
    <Column title="Marketplace" icon={Store}>
      <SearchBar query={query} kind={kind} busy={!items} onQuery={setQuery} onKind={setKind} />
      {!items ? (
        <p className="p-4 text-sm text-muted-foreground">{error ?? 'Loading…'}</p>
      ) : items.length === 0 ? (
        <EmptyState icon={Store} title="No listings" description="Publish a plugin or app composition." />
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id}>
              <ListingCard listing={item} onOpen={open} />
            </li>
          ))}
        </ul>
      )}
    </Column>
  );
}
