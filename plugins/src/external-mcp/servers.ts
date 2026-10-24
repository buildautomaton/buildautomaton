export type ExternalMcpServer = {
  type?: string;
  name: string;
  url: string;
  headers?: unknown[];
};

export function normalizeMcpServers(servers: readonly ExternalMcpServer[] | undefined): unknown[] {
  return (servers ?? [])
    .filter((server) => server.name.trim() && server.url.trim())
    .map((server) => ({
      type: server.type?.trim() || 'http',
      name: server.name.trim(),
      url: server.url.trim(),
      headers: server.headers ?? [],
    }));
}

export function mcpServersFromExtras(extras: Record<string, unknown>): unknown[] {
  const found = extras['external-mcp'];
  if (!found || typeof found !== 'object' || !('servers' in found)) return [];
  const servers = (found as { servers?: unknown }).servers;
  return Array.isArray(servers) ? servers : [];
}
