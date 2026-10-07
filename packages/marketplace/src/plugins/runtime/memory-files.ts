import type { FileStore } from '@buildautomaton/plugins';

export function memoryFileStore(): FileStore {
  const files = new Map<string, string>();
  return {
    backend: 'disk',
    read: (path) => files.get(path) ?? null,
    write: (path, content) => {
      files.set(path, content);
    },
    append: (path, content) => {
      files.set(path, `${files.get(path) ?? ''}${content}`);
    },
    remove: (path) => {
      files.delete(path);
    },
    mkdir: () => {},
    list: (dir) => {
      const prefix = dir.endsWith('/') ? dir : `${dir}/`;
      const names = new Set<string>();
      for (const path of files.keys()) {
        if (!path.startsWith(prefix)) continue;
        const name = path.slice(prefix.length).split('/')[0];
        if (name) names.add(name);
      }
      return [...names];
    },
    exists: (path) => files.has(path),
  };
}
