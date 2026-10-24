import { describe, expect, it } from 'vitest';
import { extractAgentModelSelectFromConfigOptions } from './extract-model-select.js';

describe('extractAgentModelSelectFromConfigOptions', () => {
  it('reads the model select the agent reported', () => {
    const wire = extractAgentModelSelectFromConfigOptions([
      { id: 'mode', type: 'select', options: [{ value: 'agent', name: 'Agent' }] },
      {
        id: 'model',
        type: 'select',
        category: 'model',
        currentValue: 'composer-2.5',
        options: [
          { value: 'composer-2.5', name: 'Composer 2.5' },
          { value: 'gpt-5.4-medium', name: 'GPT-5.4' },
        ],
      },
    ]);
    expect(wire?.configId).toBe('model');
    expect(wire?.currentValue).toBe('composer-2.5');
    expect(wire?.options.map((option) => option.value)).toEqual(['composer-2.5', 'gpt-5.4-medium']);
  });

  it('falls back to the largest select when nothing is labeled as a model', () => {
    const wire = extractAgentModelSelectFromConfigOptions([
      { id: 'mode', type: 'select', options: [{ value: 'agent', name: 'Agent' }, { value: 'plan', name: 'Plan' }] },
      {
        id: 'effort',
        type: 'select',
        options: [
          { value: 'low', name: 'Low' },
          { value: 'medium', name: 'Medium' },
          { value: 'high', name: 'High' },
        ],
      },
    ]);
    expect(wire?.configId).toBe('effort');
    expect(wire?.options).toHaveLength(3);
  });
});
