import { DARK_MARKER, LIGHT_MARKER, type Marker } from './color.js';

const STEPS = 9;
const SHADES = 8;

const LIGHT_RAMPS = build(LIGHT_MARKER, [252, 208, 170], [206, 216, 228]);
const DARK_RAMPS = build(DARK_MARKER, [82, 60, 46], [40, 56, 72]);

export function rampAt(marker: Marker, warmth: number): readonly string[] {
  const ramps = marker === DARK_MARKER ? DARK_RAMPS : LIGHT_RAMPS;
  const index = Math.min(STEPS - 1, Math.max(0, Math.round(warmth * (STEPS - 1))));
  return ramps[index] ?? ramps[4]!;
}

function build(marker: Marker, warm: number[], cool: number[]): string[][] {
  return Array.from({ length: STEPS }, (_, step) => {
    const warmth = step / (STEPS - 1);
    const lit = shift(marker.lit, warm, cool, warmth);
    const shade = shift(marker.shade, warm, cool, warmth);
    return Array.from({ length: SHADES }, (_, shadeStep) => rgb(lit, shade, shadeStep / (SHADES - 1)));
  });
}

function shift(base: readonly number[], warm: number[], cool: number[], warmth: number): number[] {
  const delta = warmth - 0.5;
  const toward = delta >= 0 ? warm : cool;
  const amount = Math.abs(delta) * 1.4;
  return base.map((channel, index) => channel + ((toward[index] ?? channel) - channel) * amount);
}

function rgb(lit: number[], shade: number[], t: number): string {
  const channel = (index: number) => Math.round((lit[index] ?? 0) + ((shade[index] ?? 0) - (lit[index] ?? 0)) * t);
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)})`;
}
