import { describe, expect, it, vi } from 'vitest';
import { formatCliStartup } from './run-cli.js';
import { createLog, writeInfo } from './log.js';
import { CLI_VERSION } from './version.js';

describe('formatCliStartup', () => {
  it('includes transport, cwd, and backend', () => {
    expect(
      formatCliStartup({
        mode: 'harness',
        cwd: '/work',
        backend: 'disk',
        transport: 'http',
        mcpPort: 3333,
        mcpPath: '/mcp',
        verbose: false,
      }),
    ).toBe(
      `[CLI] Starting local-cli ${CLI_VERSION} mode=harness transport=http cwd=/work backend=disk url=http://127.0.0.1:3333/mcp`,
    );
  });

  it('includes remoteUrl when set', () => {
    expect(
      formatCliStartup({
        mode: 'harness',
        cwd: '/work',
        backend: 'stream',
        transport: 'remote',
        remoteUrl: 'https://example.test',
        mcpPort: 3333,
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

describe('formatCliStartup app mode', () => {
  it('includes the UI url', () => {
    const line = formatCliStartup({
      mode: 'app',
      cwd: '/work',
      backend: 'disk',
      transport: 'http',
      mcpPort: 3333,
      mcpPath: '/mcp',
      verbose: false,
    });
    expect(line).toContain('mode=app');
    expect(line).toContain('ui=http://127.0.0.1:3333/');
  });
});
