import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function uiRootDir(): string {
  return dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
}

export function uiDistDir(): string {
  return join(uiRootDir(), 'dist');
}
