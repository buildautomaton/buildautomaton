import { describe, expect, it } from 'vitest';
import { readWidgetOpen, writeWidgetOpen } from './open-state.js';

describe('widget open state', () => {
  it('defaults to closed and remembers the last choice', () => {
    const store = new Map<string, string>();
    const memory = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: memory });
    expect(readWidgetOpen()).toBe(false);
    writeWidgetOpen(true);
    expect(readWidgetOpen()).toBe(true);
    writeWidgetOpen(false);
    expect(readWidgetOpen()).toBe(false);
  });
});
