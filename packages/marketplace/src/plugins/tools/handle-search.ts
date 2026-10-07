import type { ToolContext } from '@buildautomaton/plugins';
import type { ListingKind } from '../../types/listing.js';
import { marketFrom } from './ctx.js';
import { NO_MARKET, toolJson } from './tool-result.js';

export async function handleSearchMarketplace(args: Record<string, unknown>, ctx: ToolContext) {
  const market = marketFrom(ctx);
  if (!market) return NO_MARKET;
  const query = typeof args.query === 'string' ? args.query : '';
  const kind = args.kind === 'plugin' || args.kind === 'app' ? (args.kind as ListingKind) : undefined;
  return toolJson(await market.search(query, kind));
}

export async function handleListMarketplace(args: Record<string, unknown>, ctx: ToolContext) {
  const market = marketFrom(ctx);
  if (!market) return NO_MARKET;
  const kind = args.kind === 'plugin' || args.kind === 'app' ? (args.kind as ListingKind) : undefined;
  return toolJson(await market.list(kind));
}
