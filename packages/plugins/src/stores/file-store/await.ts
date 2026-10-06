import type { AnyFileStore } from './any-store.js';

export async function fileRead(store: AnyFileStore, path: string): Promise<string | null> {
  return await Promise.resolve(store.read(path));
}

export async function fileWrite(store: AnyFileStore, path: string, content: string): Promise<void> {
  await Promise.resolve(store.write(path, content));
}

export async function fileRemove(store: AnyFileStore, path: string): Promise<void> {
  await Promise.resolve(store.remove(path));
}

export async function fileList(store: AnyFileStore, dir: string): Promise<string[]> {
  return await Promise.resolve(store.list(dir));
}

export async function fileExists(store: AnyFileStore, path: string): Promise<boolean> {
  return await Promise.resolve(store.exists(path));
}
