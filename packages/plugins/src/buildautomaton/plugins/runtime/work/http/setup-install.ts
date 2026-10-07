import { installLocalAgentOnBridge, type AgentHarness } from '@plugins/buildautomaton/host.js';

export async function installBuildautomatonAgent(
  harnesses: readonly AgentHarness[],
  type: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  const harness = harnesses.find((item) => item.type === type);
  if (!harness?.install) return { success: false, error: `Cannot install ${type}` };
  if (harness.installTokenEnvVar && !token.trim()) {
    return { success: false, error: `${harness.installTokenEnvVar} is required` };
  }
  return installLocalAgentOnBridge({
    agentType: type,
    authToken: token.trim(),
    getHarness: (agentType) => harnesses.find((item) => item.type === agentType),
  });
}
