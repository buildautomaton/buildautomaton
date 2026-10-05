import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { widgetFile } from './widget-file.js';

describe('widgetFile', () => {
  const root = path.join('/tmp', 'director-widget');

  it('maps the popout page and its assets', () => {
    expect(widgetFile(root, '/director')).toBe(path.join(root, 'widget.html'));
    expect(widgetFile(root, '/director/assets/app.js')).toBe(path.join(root, 'assets', 'app.js'));
  });

  it('rejects paths outside the bundle', () => {
    expect(widgetFile(root, '/director/../package.json')).toBeNull();
    expect(widgetFile(root, '/api/work')).toBeNull();
  });
});
