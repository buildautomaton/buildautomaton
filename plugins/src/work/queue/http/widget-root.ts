import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE = '@buildautomaton/plugins';

export function widgetRoot(): string {
  const override = process.env.BUILDAUTOMATON_WIDGET_DIR?.trim();
  if (override) return override;
  return path.join(packageRoot(fileURLToPath(import.meta.url)), 'dist', 'widget');
}

function packageRoot(startFile: string): string {
  let dir = path.dirname(startFile);
  for (let i = 0; i < 8; i += 1) {
    const pkg = path.join(dir, 'package.json');
    if (existsSync(pkg) && readName(pkg) === PACKAGE) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.dirname(startFile);
}

function readName(pkg: string): string | undefined {
  try {
    return JSON.parse(readFileSync(pkg, 'utf8')).name as string;
  } catch {
    return undefined;
  }
}
