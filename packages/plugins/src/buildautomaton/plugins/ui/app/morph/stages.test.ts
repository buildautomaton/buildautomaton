import { describe, expect, it } from 'vitest';
import { unfurledCells } from './cells.js';
import { serial, sphereAngle, unfurl } from './pose.js';
import { SLICES, STACKS, sphereFaces } from './sphere.js';
import { morphStage } from './stages.js';

describe('morphStage', () => {
  it('walks grid, assemble, rotate, unfurl, then fill', () => {
    expect(morphStage(0).stage).toBe('grid');
    expect(morphStage(0.2).stage).toBe('assemble');
    expect(morphStage(0.46).stage).toBe('rotate');
    expect(morphStage(0.78).stage).toBe('unfurl');
    expect(morphStage(0.9).stage).toBe('fill');
    expect(morphStage(1)).toEqual({ stage: 'fill', local: 1 });
  });
});

describe('sphere assembly', () => {
  it('maps each grid tile onto one sphere face and turns without a jump', () => {
    const faces = sphereFaces();
    expect(faces).toHaveLength(STACKS * SLICES);
    const cells = unfurledCells(faces.length, SLICES, 1280, 800);
    expect(cells).toHaveLength(faces.length);
    expect(cells[0]).toMatchObject({ x: 0, y: 0 });
    expect(cells[SLICES]?.x).toBe(0);
    const last = cells[cells.length - 1];
    expect((last?.x ?? 0) + (last?.w ?? 0)).toBeCloseTo(1280);
    expect((last?.y ?? 0) + (last?.h ?? 0)).toBeCloseTo(800);
    expect(serial(0, faces.length, 0.2)).toBeGreaterThan(serial(faces.length - 1, faces.length, 0.2));
    expect(unfurl(faces.length - 1, faces.length, 0.2)).toBeGreaterThan(unfurl(0, faces.length, 0.2));
    expect(sphereAngle('rotate', 0)).toBeCloseTo(sphereAngle('assemble', 1));
    expect(sphereAngle('unfurl', 0)).toBeCloseTo(sphereAngle('rotate', 1));
    expect(sphereAngle('rotate', 1) - sphereAngle('rotate', 0)).toBeLessThan(Math.PI);
    for (const corner of faces[20]?.corners ?? []) {
      const [x, y, z] = corner;
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 5);
    }
  });
});
