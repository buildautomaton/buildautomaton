import type { ToolContext } from '@buildautomaton/plugins';
import type { MarketplaceImplementation } from '../../types/implementation.js';

export function marketFrom(ctx: ToolContext): MarketplaceImplementation | undefined {
  const value = ctx.extras.marketplace;
  return value && typeof value === 'object' ? (value as MarketplaceImplementation) : undefined;
}
