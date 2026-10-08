import { localDevAllowed } from './dev-host.js';
import { buildautomatonClient } from './embed-client.js';

export function buildautomatonScript(): string {
  return buildautomatonClient(localDevAllowed.toString());
}
