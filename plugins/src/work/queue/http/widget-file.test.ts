import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { widgetFile } from './widget-file.js';

describe('widgetFile', () => {
  const root = path.join('/tmp', 'buildautomaton-widget');

  it('maps the popout page and its assets', () => {
    expect(widgetFile(root, '/buildautomaton')).toBe(path.join(root, 'widget.html'));
    expect(widgetFile(root, '/buildautomaton/assets/app.js')).toBe(path.join(root, 'assets', 'app.js'));
  });

  it('rejects paths outside the bundle', () => {
    expect(widgetFile(root, '/buildautomaton/../package.json')).toBeNull();
    expect(widgetFile(root, '/api/work')).toBeNull();
  });
});
