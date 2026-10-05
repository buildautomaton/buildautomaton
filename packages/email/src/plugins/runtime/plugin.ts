import type { HttpRegistry, PluginInit, RuntimePlugin, StoreContext } from '@buildautomaton/runtime';
import type { EmailImplementation } from '../../types/implementation.js';
import { createEmailBackend } from './backend.js';
import { handleEmailHttp } from './http.js';
import { EMAIL_MIGRATIONS } from './migrations.js';

export function emailPlugin(init: PluginInit = {}): RuntimePlugin {
  return {
    name: 'email-sql',
    kind: 'email',
    sqlMigrations: EMAIL_MIGRATIONS,
    createFromStores: (stores: StoreContext) => {
      if (!stores.sqlStore) throw new Error('email plugin requires a sql-store plugin');
      return createEmailBackend(stores.sqlStore);
    },
    contributeHttp(http: HttpRegistry, ctx) {
      const emails = ctx.extras[ctx.pluginName] as EmailImplementation | undefined;
      if (!emails) return;
      http.addRoute({
        path: '/api/emails',
        handler: (req, res, hit) => handleEmailHttp(req, res, emails, hit.pathname),
      });
    },
    runtime: init.runtime,
  };
}
