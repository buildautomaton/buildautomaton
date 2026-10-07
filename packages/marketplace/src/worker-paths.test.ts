import { describe, expect, it } from 'vitest';
import { isMarketplaceApiPath, isMarketplaceUiPath } from './worker-paths.js';

describe('marketplace paths', () => {
  it('matches marketplace API and MCP', () => {
    expect(isMarketplaceApiPath('/api/marketplace')).toBe(true);
    expect(isMarketplaceApiPath('/api/marketplace/email')).toBe(true);
    expect(isMarketplaceApiPath('/mcp')).toBe(true);
    expect(isMarketplaceApiPath('/marketplace')).toBe(false);
    expect(isMarketplaceApiPath('/api/workspaces')).toBe(false);
  });

  it('matches the hosted UI path', () => {
    expect(isMarketplaceUiPath('/marketplace')).toBe(true);
    expect(isMarketplaceUiPath('/marketplace/')).toBe(true);
    expect(isMarketplaceUiPath('/api/marketplace')).toBe(false);
  });
});
