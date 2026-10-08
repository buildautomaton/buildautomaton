import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { buildautomatonScript } from './embed-script.js';

describe('buildautomatonScript', () => {
  it('uses a circle button to open and close the widget popup', () => {
    const mounted = boot('localhost', null);
    expect(mounted.root.id).toBe('buildautomaton-root');
    expect(mounted.frame.hidden).toBe(true);
    mounted.click();
    expect(mounted.frame.hidden).toBe(false);
    expect(mounted.tab.expanded).toBe('true');
    expect(mounted.tab.textContent).toBe('×');
    expect(mounted.frame.src).toBe('http://127.0.0.1:3333/buildautomaton?page=http%3A%2F%2Flocalhost%3A3000%2Fapp');
    mounted.click();
    expect(mounted.frame.hidden).toBe(true);
    expect(mounted.tab.textContent).toBe('+');
  });

  it('closes when the page outside the widget is clicked', () => {
    const mounted = boot('localhost', null);
    mounted.click();
    expect(mounted.frame.hidden).toBe(false);
    mounted.outside();
    expect(mounted.frame.hidden).toBe(true);
  });

  it('does nothing on a public host', () => {
    expect(boot('example.com', null).root.id).toBe('');
  });
});

function boot(hostname: string, mode: string | null) {
  const tab = element('tab');
  const frame = element('frame');
  frame.hidden = true;
  const byId: Record<string, ReturnType<typeof element>> = { tab, frame };
  const root = { id: '', attachShadow: () => ({ innerHTML: '', getElementById: (id: string) => byId[id] }) };
  const page: Record<string, (event: { composedPath: () => unknown[] }) => void> = {};
  vm.runInNewContext(buildautomatonScript(), {
    URL,
    location: { hostname, href: 'http://localhost:3000/app' },
    window: { __buildautomatonMounted: false, addEventListener() {}, removeEventListener() {} },
    document: {
      currentScript: { src: 'http://127.0.0.1:3333/buildautomaton.js', getAttribute: () => mode },
      createElement: () => root,
      documentElement: { appendChild() {} },
      addEventListener(type: string, fn: (event: { composedPath: () => unknown[] }) => void) {
        page[type] = fn;
      },
    },
  });
  return {
    root,
    frame,
    tab,
    click: () => tab.listeners.click?.(),
    outside: () => page.pointerdown?.({ composedPath: () => [] }),
  };
}

function element(id: string) {
  return {
    id,
    hidden: false,
    src: '',
    textContent: '+',
    expanded: 'false',
    listeners: {} as Record<string, () => void>,
    addEventListener(type: string, fn: () => void) {
      this.listeners[type] = fn;
    },
    setAttribute(name: string, value: string) {
      if (name === 'aria-expanded') this.expanded = value;
    },
  };
}
