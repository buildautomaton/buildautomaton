import { describe, expect, it } from 'vitest';
import { morphStage } from './stages.js';

describe('morphStage', () => {
  it('walks grid, schematic, engine, orbit, rematerialize, then fill', () => {
    expect(morphStage(0).stage).toBe('grid');
    expect(morphStage(0.2).stage).toBe('schematic');
    expect(morphStage(0.4).stage).toBe('engine');
    expect(morphStage(0.6).stage).toBe('orbit');
    expect(morphStage(0.8).stage).toBe('rematerialize');
    expect(morphStage(0.9).stage).toBe('fill');
    expect(morphStage(1)).toEqual({ stage: 'fill', local: 1 });
  });
});
