import type { Marker } from './color.js';

const LABEL = 'BUILDING';

export function drawStatus(ctx: CanvasRenderingContext2D, w: number, h: number, marker: Marker, local: number): void {
  const span = Math.min(w, h);
  const size = Math.max(11, Math.min(13, Math.round(span * 0.012)));
  ctx.save();
  ctx.globalAlpha = fade(local);
  ctx.fillStyle = marker.ink;
  ctx.font = `500 ${size}px ui-sans-serif, system-ui, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  track(ctx, LABEL, w / 2, h / 2 + span * 0.23 * 1.48, size * 0.34);
  ctx.restore();
}

function track(ctx: CanvasRenderingContext2D, label: string, center: number, y: number, gap: number): void {
  const widths = [...label].map((char) => ctx.measureText(char).width);
  const total = widths.reduce((sum, width) => sum + width, 0) + gap * (label.length - 1);
  let x = center - total / 2;
  for (let i = 0; i < label.length; i += 1) {
    ctx.fillText(label[i] ?? '', x, y);
    x += (widths[i] ?? 0) + gap;
  }
}

function fade(local: number): number {
  const edge = 0.05;
  if (local < edge) return local / edge;
  if (local > 1 - edge) return (1 - local) / edge;
  return 1;
}
