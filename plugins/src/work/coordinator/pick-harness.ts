import type { AcpEngine, AgentHarness } from '@plugins/work/host.js';

export async function pickCoordinatorHarness(
  engine: AcpEngine,
  preferred?: string,
): Promise<AgentHarness | null> {
  const found = await Promise.all(
    engine.listHarnesses().map(async (harness) => {
      try {
        return (await harness.detectPresence?.()) ? harness : null;
      } catch {
        return null;
      }
    }),
  );
  const ready = found.filter((harness): harness is AgentHarness => harness != null);
  if (preferred) {
    const chosen = ready.find((harness) => harness.type === preferred);
    if (chosen) return chosen;
  }
  return ready[0] ?? null;
}
