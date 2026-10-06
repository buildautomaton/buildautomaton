import { HTTP_DEFAULT_PORT, MCP_DEFAULT_PATH } from '@buildautomaton/plugins';
import { CLI_VERSION } from './version.js';

export function printHelp(): void {
  process.stdout.write(`local-cli ${CLI_VERSION}
Launch a local HTTP server (MCP tools + product director API) or MCP over stdio, or register remotely.

  local-cli app           Start the app. Default is Vite HMR. Use --prod on servers.

  --cwd <path>            Working directory for spawned minions
  --sessions-dir <path>   Disk session directory
  --backend <disk|stream> Session store (default: disk)
  --transport <http|stdio|remote>
  --port <n>              HTTP port (default: ${HTTP_DEFAULT_PORT})
  --ui-port <n>           Vite port in app dev (default: 5173)
  --dev                   Force Vite HMR (default)
  --prod                  Serve the built UI from the HTTP server
  --mcp-path <path>       MCP tools URL path (default: ${MCP_DEFAULT_PATH})
  --remote-url <url>      Control-plane URL when --transport remote
  --verbose
`);
}
