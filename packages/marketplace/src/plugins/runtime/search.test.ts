import { describe, expect, it } from 'vitest';
import { cosine, embed } from './embed.js';

describe('hashed semantic embed', () => {
  it('ranks a work-queue phrase closer to director text than inbox text', () => {
    const query = embed('work queue for agents to review artifacts');
    const director = embed('product director work queue review artifacts agents tell what was built');
    const inbox = embed('sql inbox mail messages folders from to subject');
    expect(cosine(query, director)).toBeGreaterThan(cosine(query, inbox));
  });
});
