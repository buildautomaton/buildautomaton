import type { ToolContext } from '@buildautomaton/runtime';
import type { ListingKind } from '../../types/listing.js';
import { marketFrom } from './ctx.js';
import { NO_MARKET, toolJson } from './tool-result.js';

export function handleSearchMarketplace(args: Record<string, unknown>, ctx: ToolContext) {
  const market = marketFrom(ctx);
  if (!market) return NO_MARKET;
  const query = typeof args.query === 'string' ? args.query : '';
  const kind = args.kind === 'plugin' || args.kind === 'app' ? (args.kind as ListingKind) : undefined;
  return toolJson(market.search(query, kind));
}

export function handleListMarketplace(args: Record<string, unknown>, ctx: ToolContext) {
  const market = marketFrom(ctx);
  if (!market) return NO_MARKET;
  const kind = args.kind === 'plugin' || args.kind === 'app' ? (args.kind as ListingKind) : undefined;
  return toolJson(market.list(kind));
}
