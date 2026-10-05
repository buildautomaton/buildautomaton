import type { PluginRuntimeContext } from '@/types/plugin.js';
import type { SqlStorePlugin } from '@/types/sql-store/plugin.js';
import { sqlStorePlugin } from './plugin.js';

/** One local SQLite file per schema. */
export function sqlStorePlugins(opts: {
  cwd?: string;
  schemas: string[];
  files?: Record<string, string>;
  runtime?: PluginRuntimeContext;
}): SqlStorePlugin[] {
  const runtime = opts.runtime ?? (opts.cwd ? { cwd: opts.cwd, log: () => {} } : undefined);
  return opts.schemas.map((schema) =>
    sqlStorePlugin({
      options: { schema, file: opts.files?.[schema] },
      runtime,
    }),
  );
}
