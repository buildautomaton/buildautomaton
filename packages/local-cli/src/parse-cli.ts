import {
  HTTP_DEFAULT_PORT,
  MCP_DEFAULT_PATH,
  normalizeHttpPath,
  type SessionBackendKind,
  type TransportKind,
} from '@buildautomaton/runtime';
import { printHelp } from './help.js';
import { CLI_VERSION } from './version.js';

export type CliMode = 'harness' | 'app';
export type AppEnv = 'dev' | 'prod';

export const UI_DEFAULT_PORT = 5173;

export type ParsedCli = {
  mode: CliMode;
  env: AppEnv;
  cwd: string;
  sessionsDir?: string;
  backend: SessionBackendKind;
  transport: TransportKind;
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
  const backend = flags.backend === 'stream' ? 'stream' : 'disk';
  return {
    mode,
    env: parseEnv(flags),
    cwd: strFlag(flags.cwd) ?? process.cwd(),
    sessionsDir: strFlag(flags['sessions-dir']),
    backend,
    transport: parseTransport(flags.transport),
    remoteUrl: strFlag(flags['remote-url']),
    mcpPort: parsePort(flags.port),
    uiPort: parsePort(flags['ui-port'], UI_DEFAULT_PORT),
    mcpPath: normalizeHttpPath(strFlag(flags['mcp-path']) ?? MCP_DEFAULT_PATH),
    verbose: flags.verbose === true,
  };
}

function parseEnv(flags: Record<string, string | true>): AppEnv {
  if (flags.dev === true) return 'dev';
  if (flags.prod === true || process.env.NODE_ENV === 'production') return 'prod';
  return 'dev';
}

function parseTransport(value: string | true | undefined): TransportKind {
  if (value === 'remote') return 'remote';
  if (value === 'stdio') return 'stdio';
  return 'http';
}

function parsePort(value: string | true | undefined, fallback = HTTP_DEFAULT_PORT): number {
  if (value === undefined) return fallback;
  const n = typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    console.error('Invalid --port (expected an integer 1-65535).');
    process.exit(1);
  }
  return n;
}

function strFlag(value: string | true | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function readFlags(args: string[]): Record<string, string | true> {
  const out: Record<string, string | true> = {};
  for (let i = 0; i < args.length; i++) {
    const token = args[i]!;
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}
