import * as fs from 'node:fs';
import * as path from 'node:path';

export type AgentModelOption = { id: string; label: string };

const memory = new Map<string, AgentModelOption[]>();
const loadedRoots = new Set<string>();

export function clearAgentModelCache(): void {
  memory.clear();
  loadedRoots.clear();
}

export function forgetAgentModels(type: string): void {
  memory.delete(type);
}

/** `null` means this process has not probed that agent yet. */
export function cachedAgentModels(type: string): AgentModelOption[] | null {
  return memory.has(type) ? (memory.get(type) ?? []) : null;
}

export function rememberAgentModels(cwd: string, type: string, models: AgentModelOption[]): void {
  memory.set(type, models);
  if (models.length === 0) return;
  const dir = path.join(cwd, '.harness');
  const file = path.join(dir, 'agent-models.json');
  let all: Record<string, AgentModelOption[]> = {};
  try {
    all = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, AgentModelOption[]>;
  } catch {
    all = {};
  }
  all[type] = models;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(all));
}

export function loadAgentModelCache(cwd: string): void {
  if (loadedRoots.has(cwd)) return;
  loadedRoots.add(cwd);
  try {
    const raw = JSON.parse(
      fs.readFileSync(path.join(cwd, '.harness', 'agent-models.json'), 'utf8'),
    ) as Record<string, AgentModelOption[]>;
    for (const [type, models] of Object.entries(raw)) {
      if (!memory.has(type) && Array.isArray(models)) memory.set(type, models);
    }
  } catch {
    /* no snapshot yet */
  }
}
