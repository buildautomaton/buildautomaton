import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { closeServer, listenLocalhost } from '@buildautomaton/plugins';
import { createSqliteWorkBackend } from '@plugins/runtime/work/sqlite/backend.js';
import { serveWork } from '../../../../http/serve-work.js';

afterEach(() => {
  delete process.env.DIRECTOR_WIDGET_DIR;
});

describe('director widget HTTP', () => {
  it('serves the launcher script and the popout page', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'director-'));
    await writeFile(path.join(dir, 'widget.html'), '<!doctype html><title>Director</title><p>Ready</p>');
    process.env.DIRECTOR_WIDGET_DIR = dir;
    const { server, sse } = serveWork(createSqliteWorkBackend());
    const port = await listenLocalhost(server, 0, '127.0.0.1');
    try {
      const script = await fetch(`http://127.0.0.1:${port}/director.js`);
      expect(script.headers.get('content-type')).toContain('javascript');
      expect(await script.text()).toContain('director-root');
      const page = await fetch(`http://127.0.0.1:${port}/director`);
      expect(await page.text()).toContain('Ready');
      const setup = await fetch(`http://127.0.0.1:${port}/api/director`);
      expect(await setup.json()).toMatchObject({ cwd: '/tmp', ready: false, agents: [] });
    } finally {
      sse.close();
      await closeServer(server);
    }
  });
});
