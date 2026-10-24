import { extractAgentModelSelectFromConfigOptions } from '@plugins/harnesses/acp/model/extract-model-select.js';
import { probeOneAgentTypeForCapabilities } from '@plugins/harnesses/acp/capabilities/probe-one-agent-type-for-capabilities.js';
import type { AgentHarness } from '@plugins/work/host.js';
import { cachedAgentModels, rememberAgentModels } from './agent-model-cache.js';
import { clearSetupCache } from './setup-cache.js';

type WarmInput = {
  cwd: string;
  harnesses: readonly AgentHarness[];
  detected: readonly string[];
  prefer?: string;
};

let pumping = false;
let prefer: string | undefined;
let snapshot: WarmInput | null = null;

/** Probe the selected agent first, then the other detected ones. Skips agents already cached. */
export function warmAgentModels(input: WarmInput): void {
  snapshot = input;
  if (input.prefer) prefer = input.prefer;
  if (pumping) return;
  pumping = true;
  void pump().finally(() => {
    pumping = false;
  });
}

export function nextProbeType(
  detected: readonly string[],
  seen: ReadonlySet<string>,
  preferred?: string,
): string | null {
  if (preferred && detected.includes(preferred) && !seen.has(preferred)) return preferred;
  return detected.find((type) => !seen.has(type)) ?? null;
}

async function pump(): Promise<void> {
  const seen = new Set<string>();
  while (snapshot) {
    const type = nextProbeType(snapshot.detected, seen, prefer);
    if (!type) return;
    seen.add(type);
    if (cachedAgentModels(type) != null) continue;
    const { cwd, harnesses } = snapshot;
    const caps = await probeOneAgentTypeForCapabilities({
      agentType: type,
      cwd,
      log: () => undefined,
      getHarness: (agentType) => harnesses.find((item) => item.type === agentType),
    });
    const wire = extractAgentModelSelectFromConfigOptions(caps?.configOptions);
    rememberAgentModels(
      cwd,
      type,
      (wire?.options ?? []).map((option) => ({ id: option.value, label: option.name })),
    );
    clearSetupCache();
  }
}
