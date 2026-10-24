import { describe, expect, it, vi } from 'vitest';
import { createLiveHub } from './hub.js';

describe('createLiveHub', () => {
  it('broadcasts typed messages and greets new sockets', () => {
    const live = createLiveHub();
    const broadcast = vi.fn();
    const send = vi.fn();
    live.attach(broadcast);
    live.welcome((next) => next('acp', { online: true }));
    live.greet(send);
    live.publish('sessions', { sessions: [] });
    expect(send).toHaveBeenCalledWith({ type: 'hello', payload: { service: 'live' } });
    expect(send).toHaveBeenCalledWith({ type: 'acp', payload: { online: true } });
    expect(broadcast).toHaveBeenCalledWith({ type: 'sessions', payload: { sessions: [] } });
  });

  it('routes inbound messages to the registered type', () => {
    const live = createLiveHub();
    const reply = vi.fn();
    live.attach(reply);
    live.on('acp', (_payload, send) => send('acp', { online: true }));
    live.receive({ type: 'acp' });
    expect(reply).toHaveBeenCalledWith({ type: 'acp', payload: { online: true } });
  });
});
