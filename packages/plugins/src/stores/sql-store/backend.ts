/** Where a named SQL schema lives. Cloudflare SQL plugins read this to pick D1 vs Durable Object. */
export type SqlBackendKind = 'sqlite' | 'do' | 'd1';
