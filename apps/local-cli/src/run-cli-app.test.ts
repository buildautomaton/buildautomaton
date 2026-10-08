import { describe, expect, it } from 'vitest';
import { formatCliStartup } from './run-cli.js';
import { CLI_VERSION } from './version.js';

describe('formatCliStartup app mode', () => {
  it('opens the Vite UI in dev', () => {
    const line = formatCliStartup({
      mode: 'app',
      env: 'dev',
      cwd: '/work',
      backend: 'disk',
      transport: 'http',
      mcpPort: 3333,
      uiPort: 5173,
      mcpPath: '/mcp',
      verbose: false,
    });
    expect(line).toContain(`local-cli ${CLI_VERSION}`);
    expect(line).toContain('env=dev');
    expect(line).toContain('ui=http://127.0.0.1:5173/');
  });

  it('points the UI at the runtime in prod', () => {
    const line = formatCliStartup({
      mode: 'app',
      env: 'prod',
      cwd: '/work',
      backend: 'disk',
      transport: 'http',
      mcpPort: 3333,
      uiPort: 5173,
      mcpPath: '/mcp',
      verbose: false,
    });
    expect(line).toContain('env=prod');
    expect(line).toContain('ui=http://127.0.0.1:3333/');
  });
});
