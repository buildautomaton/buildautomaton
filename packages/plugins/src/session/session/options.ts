export type DiskSessionOptions = { dir: string; id?: string };
export type StreamSessionOptions = { layer: true; id?: string };
export type SqlSessionOptions = { id?: string; schema?: string };
export type SessionBackendKind = 'disk' | 'stream' | 'sql';
