import type { SqlBackendKind } from './backend.js';
import type { AnySqlStore } from './any-store.js';

/** Opens one SQL store per key (one Durable Object per marketplace plugin). */
export type SqlStoreOpener = {
  backend?: SqlBackendKind;
  open(key: string): AnySqlStore | Promise<AnySqlStore>;
};

export function isSqlStoreOpener(value: unknown): value is SqlStoreOpener {
  return Boolean(value && typeof value === 'object' && typeof (value as SqlStoreOpener).open === 'function');
}
