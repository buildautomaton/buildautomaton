import { useEffect, useRef, useState } from 'react';
import { AppCanvas } from '../canvas.js';
import { PromptGate } from '../../../../app/prompt-gate.js';
import { drawMorph } from './frame.js';
import { MORPH_MS } from './stages.js';

export function MorphOverlay({ prompt, onDone }: { prompt: string; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(onDone);
  const [reveal, setReveal] = useState(false);
  doneRef.current = onDone;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doneRef.current();
      return;
    }
    const paper = getComputedStyle(document.body).backgroundColor || '#ffffff';
    const started = performance.now();
    let frame = 0;
    let hold = 0;
    let stop = false;
    let revealed = false;
    const tick = (now: number) => {
      if (stop) return;
      const view = fitCanvas(canvas);
      const ctx = canvas.getContext('2d');
      const t = Math.min(1, (now - started) / MORPH_MS);
      if (ctx && !revealed && drawMorph(ctx, view.w, view.h, t, paper)) {
        revealed = true;
        setReveal(true);
      } else if (ctx) drawMorph(ctx, view.w, view.h, t, paper);
      if (t < 1) frame = requestAnimationFrame(tick);
      else hold = window.setTimeout(() => doneRef.current(), 450);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      stop = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(hold);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      {reveal ? <AppCanvas prompt={prompt} /> : <PromptGate lockedValue={prompt} />}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
    </div>
  );
}

function fitCanvas(canvas: HTMLCanvasElement): { w: number; h: number } {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  const width = Math.floor(w * dpr);
  const height = Math.floor(h * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}
