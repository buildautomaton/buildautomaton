import type { Listing, ListingKind, ListingSummary, PublishListingInput } from '../../types/listing.js';

async function json<T>(res: Promise<Response>): Promise<T> {
  const resolved = await res;
  if (resolved.status === 204) return undefined as T;
  const body = (await resolved.json().catch(() => ({}))) as T & { error?: string };
  if (!resolved.ok) throw new Error(body.error || resolved.statusText);
  return body;
}

export function createMarketplaceClient(base = '') {
  const root = `${base}/api/marketplace`;
  return {
    list: (kind?: ListingKind, query?: string) => {
      const params = new URLSearchParams();
      if (kind) params.set('kind', kind);
      if (query) params.set('q', query);
      const suffix = params.size ? `?${params}` : '';
      return json<ListingSummary[]>(fetch(`${root}${suffix}`));
    },
    get: (id: string) => json<Listing>(fetch(`${root}/${id}`)),
    publish: (input: PublishListingInput) =>
      json<Listing>(fetch(root, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) })),
  };
}
