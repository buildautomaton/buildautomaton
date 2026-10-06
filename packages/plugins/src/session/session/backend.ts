import type { SessionImplementation } from './implementation.js';

export type SessionBackend = { id: string } & SessionImplementation;
export type SessionBackendWrap = (base: SessionBackend) => SessionBackend;
