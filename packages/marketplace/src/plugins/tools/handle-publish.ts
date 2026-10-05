import type { ToolContext } from '@buildautomaton/runtime';
import { parsePublish } from '../runtime/http-parse.js';
import { marketFrom } from './ctx.js';
import { NO_MARKET, toolJson } from './tool-result.js';

export function handlePublishMarketplace(args: Record<string, unknown>, ctx: ToolContext) {
  const market = marketFrom(ctx);
  if (!market) return NO_MARKET;
  const body = parsePublish(args);
  if ('error' in body) return toolJson(body, true);
  return toolJson(market.publish(body));
}
