import type { PluginInit, RuntimePlugin, TransportEndpoint } from '@buildautomaton/runtime';
import { sqlStorePlugin } from '@buildautomaton/runtime';
import { emailPlugin, EMAIL_SQL_SCHEMA } from './plugins/runtime/plugin.js';
import { EMAIL_MIGRATIONS } from './plugins/runtime/migrations.js';

export type EmailSetOptions = {
  /** Local file store for the email schema. Pass `false` on a cloud host that supplies a DO. */
  sql?: boolean;
};

export function emailHttpEndpoints(): TransportEndpoint[] {
  return [{ plugin: 'email-sql', path: '/api' }];
}

export function emailSet(init: PluginInit<EmailSetOptions> = {}): RuntimePlugin[] {
  const runtime = init.runtime;
  const sql =
    init.options?.sql === false
      ? []
      : [sqlStorePlugin({ options: { schema: EMAIL_SQL_SCHEMA }, sqlMigrations: EMAIL_MIGRATIONS, runtime })];
  return [...sql, emailPlugin({ runtime })];
}
