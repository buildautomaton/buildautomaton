import type { Listing, ListingKind, ListingSummary, PublishListingInput } from '../../types/listing.js';

async function json<T>(res: Promise<Response>): Promise<T> {
  const resolved = await res;
  if (resolved.status === 204) return undefined as T;
  const body = await resolved.json().catch(() => undefined);
  if (!resolved.ok) {
    const error = body && typeof body === 'object' && 'error' in body ? String(body.error) : resolved.statusText;
    throw new Error(error || 'Marketplace request failed');
  }
  return body as T;
}

export function asListingSummaries(body: unknown): ListingSummary[] {
  if (Array.isArray(body)) return body as ListingSummary[];
  if (body && typeof body === 'object' && Array.isArray((body as { items?: unknown }).items)) {
    return (body as { items: ListingSummary[] }).items;
  }
  throw new Error('Marketplace catalog did not return a list');
}

export function createMarketplaceClient(base = '') {
  const root = `${base}/api/marketplace`;
  return {
    list: async (kind?: ListingKind, query?: string) => {
      const params = new URLSearchParams();
      if (kind) params.set('kind', kind);
      if (query) params.set('q', query);
      const suffix = params.size ? `?${params}` : '';
      return asListingSummaries(await json(fetch(`${root}${suffix}`)));
    },
    get: (id: string) => json<Listing>(fetch(`${root}/${id}`)),
    publish: (input: PublishListingInput) =>
      json<Listing>(fetch(root, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) })),
  };
}
