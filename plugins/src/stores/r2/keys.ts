export function r2Key(prefix: string, path: string): string {
  const clean = path.replace(/^\/+/, '');
  return prefix ? `${prefix.replace(/\/+$/, '')}/${clean}` : clean;
}

export function r2ChildNames(keys: string[], prefix: string): string[] {
  const root = prefix.endsWith('/') ? prefix : `${prefix}/`;
  const names = new Set<string>();
  for (const key of keys) {
    if (!key.startsWith(root)) continue;
    const name = key.slice(root.length).split('/')[0];
    if (name) names.add(name);
  }
  return [...names];
}
