import { HTTP_DEFAULT_PORT } from '@buildautomaton/plugins';
import type { SessionBackendKind, TransportKind } from '@buildautomaton/plugins';

export function readFlags(args: string[]): Record<string, string | true> {
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

export function strFlag(value: string | true | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function parsePort(value: string | true | undefined, fallback = HTTP_DEFAULT_PORT): number {
  if (value === undefined) return fallback;
  const n = typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 65535) {
    console.error('Invalid --port (expected an integer 1-65535).');
    process.exit(1);
  }
  return n;
}

export function parseEnv(flags: Record<string, string | true>): 'dev' | 'prod' {
  if (flags.dev === true) return 'dev';
  if (flags.prod === true || process.env.NODE_ENV === 'production') return 'prod';
  return 'dev';
}

export function parseTransport(value: string | true | undefined): TransportKind {
  if (value === 'remote') return 'remote';
  if (value === 'stdio') return 'stdio';
  return 'http';
}

export function parseBackend(value: string | true | undefined): SessionBackendKind {
  return value === 'stream' ? 'stream' : 'disk';
}
