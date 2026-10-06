import type { AddEmailInput, EmailPatch } from '../../types/email.js';
import { asFolder } from './rows.js';

export function parseAdd(body: unknown): AddEmailInput | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Expected JSON' };
  const rec = body as Record<string, unknown>;
  const fromAddr = typeof rec.fromAddr === 'string' ? rec.fromAddr.trim() : '';
  const toAddr = typeof rec.toAddr === 'string' ? rec.toAddr.trim() : '';
  if (!fromAddr || !toAddr) return { error: 'fromAddr and toAddr are required' };
  return {
    fromAddr,
    toAddr,
    subject: typeof rec.subject === 'string' ? rec.subject : '',
    body: typeof rec.body === 'string' ? rec.body : '',
    folder: rec.folder === undefined ? 'inbox' : asFolder(rec.folder),
  };
}

export function parsePatch(body: unknown): EmailPatch | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Expected JSON' };
  const rec = body as Record<string, unknown>;
  const patch: EmailPatch = {};
  if (rec.folder !== undefined) patch.folder = asFolder(rec.folder);
  if (typeof rec.read === 'boolean') patch.read = rec.read;
  if (typeof rec.subject === 'string') patch.subject = rec.subject;
  if (typeof rec.body === 'string') patch.body = rec.body;
  return patch;
}
