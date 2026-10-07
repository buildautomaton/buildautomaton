import { describe, expect, it } from 'vitest';
import { createMarketplaceHost } from './host.js';
import { testMarketplaceStores } from './plugins/runtime/test-stores.js';

describe('createMarketplaceHost', () => {
  it('serves seeded listings over fetch', async () => {
    const handle = await createMarketplaceHost(testMarketplaceStores());
    await handle.start();
    const res = await handle.fetch(new Request('http://127.0.0.1/api/marketplace?kind=plugin'));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { slug: string }[];
    expect(body.some((row) => row.slug === 'email')).toBe(true);
    await handle.stop();
  });
});
