import { directorDevAllowed } from './dev-host.js';
import { directorClient } from './director-client.js';

export function directorScript(): string {
  return directorClient(directorDevAllowed.toString());
}
