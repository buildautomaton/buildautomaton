import type { TransportImplementation } from './implementation.js';

export type HostTransport = { id: string } & TransportImplementation;
