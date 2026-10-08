import type { HttpContributeContext } from '@plugins/transport/http/types/contribution.js';
import { asLiveHub, type LiveHub, type LiveSession } from '@plugins/live/types.js';
import type { SessionImplementation } from './implementation.js';
import type { SessionRecord } from './records.js';

export function attachSessionLive(ctx: HttpContributeContext): void {
  const live = asLiveHub(ctx.extras);
  const backend = ctx.backend;
  if (!live || !backend) return;
  const publish = () => void pushSessions(backend, live);
  live.welcome((send) => {
    void Promise.resolve(backend.list()).then((rows) => send('sessions', { sessions: mapSessions(rows) }));
  });
  const create = backend.create.bind(backend);
  const patch = backend.patch.bind(backend);
  backend.create = async (record) => {
    await create(record);
    publish();
  };
  backend.patch = async (sessionId, next) => {
    await patch(sessionId, next);
    publish();
  };
}

async function pushSessions(backend: SessionImplementation, live: LiveHub): Promise<void> {
  live.publish('sessions', { sessions: mapSessions(await backend.list()) });
}

function mapSessions(rows: SessionRecord[]): LiveSession[] {
  return rows.map((row) => ({ id: row.id, status: row.status, harness: row.harness }));
}
