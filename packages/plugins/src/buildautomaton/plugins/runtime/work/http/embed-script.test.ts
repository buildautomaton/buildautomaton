import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { buildautomatonScript } from './embed-script.js';

describe('buildautomatonScript', () => {
  it('uses a bottom tab to open, resize, and close the sidebar', () => {
    const mounted = boot('localhost', null);
    expect(mounted.root.id).toBe('buildautomaton-root');
    expect(mounted.frame.hidden).toBe(true);
    mounted.click();
    expect(mounted.frame.hidden).toBe(false);
    expect(mounted.tab.expanded).toBe('true');
    expect(mounted.frame.src).toBe('http://127.0.0.1:3333/buildautomaton?page=http%3A%2F%2Flocalhost%3A3000%2Fapp');
    expect(mounted.frame.style.width).toBe('420px');
    mounted.drag(500, 400);
    expect(mounted.frame.style.width).toBe('520px');
    expect(mounted.tab.style.right).toBe('520px');
    mounted.click();
    expect(mounted.frame.hidden).toBe(true);
    expect(mounted.tab.style.right).toBe('0px');
  });

  it('does nothing on a public host', () => {
    expect(boot('example.com', null).root.id).toBe('');
  });
});

function boot(hostname: string, mode: string | null) {
  const listeners: Record<string, (event: { origin?: string; data?: unknown; clientX?: number }) => void> = {};
  const tab = element('tab');
  const frame = element('frame');
  const resize = element('resize');
  frame.hidden = true;
  resize.hidden = true;
  const byId: Record<string, ReturnType<typeof element>> = { tab, frame, resize };
  const root = { id: '', attachShadow: () => ({ innerHTML: '', getElementById: (id: string) => byId[id] }) };
  const window = {
    __buildautomatonMounted: false,
    innerWidth: 1200,
    addEventListener: (type: string, fn: (event: { clientX?: number; origin?: string; data?: unknown }) => void) => {
      listeners[type] = fn;
    },
    removeEventListener() {},
  };
  vm.runInNewContext(buildautomatonScript(), {
    URL,
    localStorage: { getItem: () => null, setItem() {} },
    location: { hostname, href: 'http://localhost:3000/app' },
    window,
    document: {
      currentScript: { src: 'http://127.0.0.1:3333/buildautomaton.js', getAttribute: () => mode },
      createElement: () => root,
      documentElement: { appendChild() {} },
    },
  });
  return {
    root,
    frame,
    tab,
    click: () => tab.listeners.click?.({ clientX: 0 }),
    drag: (from: number, to: number) => {
      resize.listeners.pointerdown?.({ preventDefault() {}, clientX: from });
      listeners.pointermove?.({ clientX: to });
      listeners.pointerup?.({ clientX: to });
    },
  };
}

function element(id: string) {
  const style: { width?: string; right?: string } = {};
  return {
    id,
    hidden: false,
    src: '',
    style,
    expanded: 'false',
    listeners: {} as Record<string, (event: { preventDefault?: () => void; clientX: number }) => void>,
    addEventListener(type: string, fn: (event: { preventDefault?: () => void; clientX: number }) => void) {
      this.listeners[type] = fn;
    },
    setAttribute(_name: string, value: string) {
      this.expanded = value;
    },
    getBoundingClientRect() {
      return { width: Number.parseFloat(style.width ?? '420') };
    },
  };
}
