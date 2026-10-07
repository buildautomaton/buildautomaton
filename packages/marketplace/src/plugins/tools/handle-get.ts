import type { ToolContext } from '@buildautomaton/plugins';
import { descriptionMarkdown } from '../runtime/search-text.js';
import { marketFrom } from './ctx.js';
import { NO_MARKET, toolJson } from './tool-result.js';

export async function handleGetListing(args: Record<string, unknown>, ctx: ToolContext) {
  const market = marketFrom(ctx);
  if (!market) return NO_MARKET;
  const id = typeof args.id === 'string' ? args.id : '';
  const listing = await market.get(id);
  if (!listing) return toolJson({ error: 'Not found' }, true);
  return toolJson({
    ...listing,
    description: descriptionMarkdown(listing.artifacts, listing.summary),
  });
}

export async function handleGetSource(args: Record<string, unknown>, ctx: ToolContext) {
  const market = marketFrom(ctx);
  if (!market) return NO_MARKET;
  const id = typeof args.id === 'string' ? args.id : '';
  const path = typeof args.path === 'string' ? args.path : undefined;
  const found = await market.source(id, path);
  return found ? toolJson(found) : toolJson({ error: 'Not found' }, true);
}
