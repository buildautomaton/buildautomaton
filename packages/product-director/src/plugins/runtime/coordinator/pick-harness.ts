import type { AcpEngine, AgentHarness } from '@buildautomaton/runtime';

export async function pickCoordinatorHarness(engine: AcpEngine): Promise<AgentHarness | null> {
  for (const harness of engine.listHarnesses()) {
    try {
      if (await harness.detectPresence?.()) return harness;
    } catch {
      continue;
    }
  }
  return null;
}
