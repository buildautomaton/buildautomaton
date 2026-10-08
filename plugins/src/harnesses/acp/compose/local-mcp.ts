import { HTTP_DEFAULT_HOST, MCP_DEFAULT_PATH, MCP_SERVER_NAME } from '@buildautomaton/runtime';

export type AccessPort = { port: number | null };

export function createAccessPort(): AccessPort {
  return { port: null };
}

/** ACP `session/new` MCP server pointing at this runtime's HTTP tools. */
export function localMcpServers(port: number | null, path = MCP_DEFAULT_PATH): unknown[] {
  if (!port) return [];
  return [
    {
      type: 'http',
      name: MCP_SERVER_NAME,
      url: `http://${HTTP_DEFAULT_HOST}:${port}${path}`,
    },
  ];
}
