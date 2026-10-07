const API_PREFIXES = ['/api/marketplace', '/mcp'];

export function isMarketplaceApiPath(pathname: string): boolean {
  return API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isMarketplaceUiPath(pathname: string): boolean {
  return pathname === '/marketplace' || pathname.startsWith('/marketplace/');
}
