import { ease } from './stages.js';

export const NAVY = '#07131f';
export const CYAN = '#8fe7ff';
export const INK = '#3a3a40';

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
