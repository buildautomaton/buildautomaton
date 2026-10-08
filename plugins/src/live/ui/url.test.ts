import { describe, expect, it } from 'vitest';
import { resolveWsUrl } from './url.js';

describe('resolveWsUrl', () => {
  const loc = { protocol: 'http:', host: 'localhost:5173' };

  it('uses an explicit live URL', () => {
    expect(resolveWsUrl('/api/live', { liveUrl: 'ws://cli:9/api/live' }, loc)).toBe('ws://cli:9/api/live');
  });

  it('talks to the CLI origin, not the Vite host', () => {
    expect(resolveWsUrl('/api/live', { apiOrigin: 'http://127.0.0.1:3347' }, loc)).toBe(
      'ws://127.0.0.1:3347/api/live',
    );
  });

  it('falls back to the page host when the CLI serves the UI', () => {
    expect(resolveWsUrl('/api/live', {}, { protocol: 'https:', host: 'app.example' })).toBe(
      'wss://app.example/api/live',
    );
  });
});
