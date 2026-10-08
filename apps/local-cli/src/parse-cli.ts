import { MCP_DEFAULT_PATH, normalizeHttpPath } from '@buildautomaton/plugins';
import { printHelp } from './help.js';
import { parseBackend, parseEnv, parsePort, parseTransport, readFlags, strFlag } from './parse-flags.js';
import { CLI_VERSION } from './version.js';

export type CliMode = 'harness' | 'app';
export type AppEnv = 'dev' | 'prod';

export const UI_DEFAULT_PORT = 5173;

export type ParsedCli = {
  mode: CliMode;
  env: AppEnv;
  cwd: string;
  sessionsDir?: string;
  backend: ReturnType<typeof parseBackend>;
  transport: ReturnType<typeof parseTransport>;
  remoteUrl?: string;
  mcpPort: number;
  uiPort: number;
  mcpPath: string;
  verbose: boolean;
};

export function parseCli(argv: string[]): ParsedCli {
  const raw = argv.slice(2);
  const mode: CliMode = raw[0] === 'app' ? 'app' : 'harness';
  const args = mode === 'app' ? raw.slice(1) : raw;
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  if (args.includes('--version') || args.includes('-v')) {
    process.stdout.write(`${CLI_VERSION}\n`);
    process.exit(0);
  }
  const flags = readFlags(args);
  return {
    mode,
    env: parseEnv(flags),
    cwd: strFlag(flags.cwd) ?? process.cwd(),
    sessionsDir: strFlag(flags['sessions-dir']),
    backend: parseBackend(flags.backend),
    transport: parseTransport(flags.transport),
    remoteUrl: strFlag(flags['remote-url']),
    mcpPort: parsePort(flags.port),
    uiPort: parsePort(flags['ui-port'], UI_DEFAULT_PORT),
    mcpPath: normalizeHttpPath(strFlag(flags['mcp-path']) ?? MCP_DEFAULT_PATH),
    verbose: flags.verbose === true,
  };
}
