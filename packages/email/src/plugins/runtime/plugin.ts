import {
  requireSqlStore,
  type HttpRegistry,
  type PluginInit,
  type RuntimePlugin,
  type StoreContext,
} from '@buildautomaton/runtime';
import type { EmailImplementation } from '../../types/implementation.js';
import { createEmailBackend } from './backend.js';
import { handleEmailHttp } from './http.js';
import { EMAIL_MIGRATIONS } from './migrations.js';

export const EMAIL_SQL_SCHEMA = 'email';

export function emailPlugin(init: PluginInit = {}): RuntimePlugin {
  return {
    name: 'email-sql',
    kind: 'email',
    sqlSchema: EMAIL_SQL_SCHEMA,
    sqlMigrations: EMAIL_MIGRATIONS,
    createFromStores: (stores: StoreContext) =>
      createEmailBackend(requireSqlStore(stores, EMAIL_SQL_SCHEMA, 'email plugin')),
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
