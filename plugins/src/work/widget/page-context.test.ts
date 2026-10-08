import { describe, expect, it } from 'vitest';
import { pageFromLocation, promptWithPage } from './page-context.js';

describe('page context', () => {
  it('reads the host page from the query string', () => {
    expect(pageFromLocation('?page=http%3A%2F%2Flocalhost%3A3000%2F')).toBe('http://localhost:3000/');
    expect(pageFromLocation('')).toBeNull();
  });

  it('appends the page under the prompt', () => {
    expect(promptWithPage('Make the header sticky', 'http://localhost:3000/')).toBe(
      'Make the header sticky\n\nPage: http://localhost:3000/',
    );
    expect(promptWithPage('Make the header sticky', null)).toBe('Make the header sticky');
  });
});
