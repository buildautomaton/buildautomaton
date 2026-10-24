import type { HttpRegistry } from '@plugins/transport/http/types/registry.js';
import { readGitContext } from './context.js';
import { writeGitJson } from './write-json.js';

export function contributeGitRoutes(http: HttpRegistry, cwd: string): void {
  http.addRoute({
    path: '/api/git',
    handler: async (req, res) => {
      if (req.method !== 'GET') {
        writeGitJson(res, 405, { error: 'Method not allowed' });
        return;
      }
      writeGitJson(res, 200, await readGitContext(cwd));
    },
  });
}
