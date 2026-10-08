import { ease } from './stages.js';

export type Marker = {
  board: string;
  ink: string;
  lit: readonly [number, number, number];
  shade: readonly [number, number, number];
};

export const LIGHT_MARKER: Marker = {
  board: '#e4ddd0',
  ink: '#1c1916',
  lit: [246, 241, 230],
  shade: [168, 156, 138],
};

export const DARK_MARKER: Marker = {
  board: '#1b1d21',
  ink: '#f3ecdf',
  lit: [48, 50, 56],
  shade: [16, 17, 20],
};

export function markerFor(dark: boolean): Marker {
  return dark ? DARK_MARKER : LIGHT_MARKER;
}

export function mixColor(from: string, to: string, t: number): string {
  const [ar, ag, ab] = parseColor(from);
  const [br, bg, bb] = parseColor(to);
  const u = ease(t);
  const channel = (a: number, b: number) => Math.round(a + (b - a) * u);
  return `rgb(${channel(ar, br)} ${channel(ag, bg)} ${channel(ab, bb)})`;
}

function parseColor(input: string): [number, number, number] {
  const hex = input.trim();
  if (hex.startsWith('#')) {
    const full = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
    return [parseInt(full.slice(1, 3), 16), parseInt(full.slice(3, 5), 16), parseInt(full.slice(5, 7), 16)];
  }
  const match = input.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return [255, 255, 255];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}
