/** HTTP proxy target. Websockets talk to this origin directly, not through Vite. */
export function viteApiOrigin(command: 'serve' | 'build'): string | undefined {
  const explicit = process.env.VITE_API_ORIGIN ?? process.env.META_HARNESS_API;
  if (explicit) return explicit;
  return command === 'serve' ? 'http://127.0.0.1:3333' : undefined;
}

export function viteApiDefine(command: 'serve' | 'build'): Record<string, string> {
  const origin = viteApiOrigin(command);
  if (!origin) return {};
  return { 'import.meta.env.VITE_API_ORIGIN': JSON.stringify(origin) };
}
