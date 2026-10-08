/**
 * Plugin catalog on the @buildautomaton/runtime registry.
 * Category folders: app, harnesses, session, stores, tools, transport, work.
 */
import './register-services.js';
export * from '@buildautomaton/runtime';
export * from './catalog.js';
export type * from './plugin-catalog-types.js';
export type * from './service-types.js';
export {
  pickSqlStore,
  requireSqlStore,
  requireAnySqlStore,
  pickSqlOpener,
  requireSqlOpener,
} from './stores/sql-store/pick.js';
export { requireFileStore } from './stores/file-store/pick.js';
export { storeContext } from './apply/store-context.js';
export { asHost } from './host-slots.js';
export type { HostSlots } from './host-slots.js';
export { DEFAULT_SQL_SCHEMA, sqlStorePluginName } from './stores/sql-store/schema.js';
export { sqlAll, sqlExec, sqlGet, sqlRun, isSqlStore, isSqlStoreOpener } from './stores/sql-store/index.js';
export { isFileStore, fileExists, fileList, fileRead, fileRemove, fileWrite } from './stores/file-store/index.js';
export { sqlStoreService } from './stores/sql-store/declare.js';
export { fileStoreService } from './stores/file-store/declare.js';
export { sessionService } from './session/session/declare.js';
export { harnessService } from './harnesses/harness/declare.js';
export { toolsService } from './tools/tools/declare.js';
export { httpService } from './transport/http/declare.js';
export { transportService } from './transport/transport/declare.js';
