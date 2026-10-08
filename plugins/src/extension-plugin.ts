import type { RuntimePlugin } from '@buildautomaton/runtime';
import type { SqlMigration } from './stores/sql-store/migration.js';
import type { StoreContext, HttpContributeContext } from './transport/http/types/contribution.js';
import type { HttpRegistry } from './transport/http/types/registry.js';

/** Feature plugin fields the runtime treats structurally (migrations, stores, HTTP). */
export type ExtensionPlugin = RuntimePlugin & {
  sqlMigrations?: readonly SqlMigration[];
  sqlSchema?: string;
  createFromStores?: (stores: StoreContext) => unknown;
  contributeHttp?: (http: HttpRegistry, ctx: HttpContributeContext) => void;
};
