import type { ToolRegistry } from '@plugins/tools/tools/implementation.js';
import type { ToolsPrompt } from '@plugins/tools/tools/prompts.js';

export function mergeToolRegistries(registries: ToolRegistry[]): ToolRegistry {
  return {
    listTools: async () => {
      const tools = [];
      const seen = new Set<string>();
      for (const reg of registries) {
        for (const tool of await reg.listTools()) {
          if (seen.has(tool.name)) continue;
          seen.add(tool.name);
          tools.push(tool);
        }
      }
      return tools;
    },
    callTool: async (name, args, extras) => {
      for (const reg of registries) {
        const listed = await reg.listTools();
        if (listed.some((t) => t.name === name)) return reg.callTool(name, args, extras);
      }
      return {
        content: [{ type: 'text', text: JSON.stringify({ error: `Unknown tool: ${name}` }) }],
        isError: true,
      };
    },
    instructions: async () => mergeInstructions(registries),
    prompts: async () => mergePrompts(registries),
    listResources: async () => {
      const out = [];
      const seen = new Set<string>();
      for (const reg of registries) {
        for (const resource of (await reg.listResources?.()) ?? []) {
          if (seen.has(resource.uri)) continue;
          seen.add(resource.uri);
          out.push(resource);
        }
      }
      return out;
    },
    readResource: async (uri: string) => {
      for (const reg of registries) {
        const found = await reg.readResource?.(uri);
        if (found) return found;
      }
      return null;
    },
  };
}

async function mergeInstructions(registries: ToolRegistry[]): Promise<string | undefined> {
  const parts: string[] = [];
  for (const reg of registries) {
    const text = (await reg.instructions?.())?.trim();
    if (text) parts.push(text);
  }
  return parts.length ? parts.join('\n\n') : undefined;
}

async function mergePrompts(registries: ToolRegistry[]): Promise<ToolsPrompt[]> {
  const out: ToolsPrompt[] = [];
  const seen = new Set<string>();
  for (const reg of registries) {
    for (const prompt of (await reg.prompts?.()) ?? []) {
      if (seen.has(prompt.name)) continue;
      seen.add(prompt.name);
      out.push(prompt);
    }
  }
  return out;
}
