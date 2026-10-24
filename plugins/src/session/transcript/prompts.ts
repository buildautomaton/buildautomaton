import { asRecord, textOf } from './text.js';
import { userRequestText } from './user-request.js';

export type SessionPrompt = {
  id: string;
  text: string;
  sentAt: string;
  status: 'running' | 'completed' | 'failed';
  endedAt: string;
};

type Event = { ts?: string; kind?: string; payload?: unknown };

function userText(event: Event): string | null {
  if (event.kind !== 'update') return null;
  const rec = asRecord(event.payload);
  if (!rec) return null;
  const kind = String(rec.sessionUpdate ?? rec.session_update ?? '');
  if (!/user_message/i.test(kind)) return null;
  return textOf(rec) || null;
}

/** Prompts in a session: the opening user request, then each ACP user_message. */
export function sessionPrompts(
  session: { prompt: string; status: string; createdAt: string; updatedAt: string },
  events: Event[],
): SessionPrompt[] {
  const first = userRequestText(session.prompt);
  const rows: { text: string; sentAt: string }[] = first
    ? [{ text: first, sentAt: session.createdAt }]
    : [];
  for (const event of events) {
    const text = userText(event);
    if (!text || text === rows[rows.length - 1]?.text) continue;
    rows.push({ text, sentAt: event.ts ?? session.updatedAt });
  }
  return rows.map((row, index) => {
    const last = index === rows.length - 1;
    const next = rows[index + 1];
    const running = last && session.status === 'running';
    return {
      id: String(index),
      text: row.text,
      sentAt: row.sentAt,
      status: running ? 'running' : last && session.status === 'failed' ? 'failed' : 'completed',
      endedAt: running ? row.sentAt : (next?.sentAt ?? session.updatedAt),
    };
  });
}

export function promptPreview(text: string): string {
  return text.trim().split('\n').filter(Boolean).slice(0, 2).join('\n');
}
