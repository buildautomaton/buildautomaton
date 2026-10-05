import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { formatCliStartup } from './run-cli.js';
import { createLog, writeInfo } from './log.js';
import { CLI_VERSION } from './version.js';

describe('formatCliStartup', () => {
  it('includes transport, cwd, and backend', () => {
    expect(
      formatCliStartup({
        mode: 'harness',
        env: 'dev',
        cwd: '/work',
        backend: 'disk',
        transport: 'http',
        mcpPort: 3333,
        uiPort: 5173,
        mcpPath: '/mcp',
        verbose: false,
      }),
    ).toBe(
      `[CLI] Starting local-cli ${CLI_VERSION} mode=harness env=dev transport=http cwd=/work backend=disk url=http://127.0.0.1:3333/mcp`,
    );
  });

  it('includes remoteUrl when set', () => {
    expect(
      formatCliStartup({
        mode: 'harness',
        env: 'dev',
        cwd: '/work',
        backend: 'stream',
        transport: 'remote',
        remoteUrl: 'https://example.test',
        mcpPort: 3333,
        uiPort: 5173,
        mcpPath: '/mcp',
        verbose: true,
      }),
    ).toContain('remoteUrl=https://example.test');
  });
});

describe('createLog', () => {
  it('writes verbose lines and always-on info to stderr', () => {
    const writes: string[] = [];
    const spy = vi.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
      writes.push(String(chunk));
      return true;
    });
    createLog(false)('hidden');
    createLog(true)('shown');
    writeInfo('always');
    spy.mockRestore();
    expect(writes).toEqual(['shown\n', 'always\n']);
  });
});

describe('runtimeOptionsFromCli', () => {
  it('composes the email app plugins', async () => {
    const { runtimeOptionsFromCli } = await import('./run-cli.js');
    const cwd = mkdtempSync(path.join(tmpdir(), 'cli-email-'));
    const options = runtimeOptionsFromCli({
      mode: 'app',
      env: 'dev',
      cwd,
      backend: 'disk',
      transport: 'http',
      mcpPort: 3333,
      uiPort: 5173,
      mcpPath: '/mcp',
      verbose: false,
    });
    expect(options.plugins?.some((plugin) => plugin.name === 'email-sql')).toBe(false);
    expect(options.plugins?.some((plugin) => plugin.name === 'store-sql-marketplace')).toBe(true);
    expect(options.plugins?.some((plugin) => plugin.name === 'marketplace-sql')).toBe(true);
    expect(options.plugins?.some((plugin) => plugin.name === 'marketplace-tools')).toBe(true);
  });
});
