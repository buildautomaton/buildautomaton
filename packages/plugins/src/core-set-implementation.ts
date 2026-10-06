import type { HarnessImplementation } from '@plugins/harnesses/harness/implementation.js';
import type { SessionImplementation } from '@plugins/session/session/implementation.js';
import type { RemoteTransportImplementation } from '@plugins/transport/transport/options.js';
import type { ToolsImplementation } from '@plugins/tools/tools/implementation.js';
import type { FileStore } from '@plugins/stores/file-store/interface.js';
import type { SqlStore } from '@plugins/stores/sql-store/interface.js';
export type CoreSetImplementation = {
  harness?: Partial<HarnessImplementation>;
  session?: Partial<SessionImplementation>;
  transport?: RemoteTransportImplementation;
  tools?: Partial<ToolsImplementation>;
  fileStore?: Partial<FileStore>;
  sqlStore?: Partial<SqlStore>;
};
