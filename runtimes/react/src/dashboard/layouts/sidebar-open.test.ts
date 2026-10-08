import { describe, expect, it } from 'vitest';
import { readSidebarOpen, writeSidebarOpen } from './sidebar-open.js';

describe('sidebar open state', () => {
  it('defaults to open and remembers the last choice', () => {
    const store = new Map<string, string>();
    const memory = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: memory });
    expect(readSidebarOpen()).toBe(true);
    writeSidebarOpen(false);
    expect(readSidebarOpen()).toBe(false);
    writeSidebarOpen(true);
    expect(readSidebarOpen()).toBe(true);
  });
});
