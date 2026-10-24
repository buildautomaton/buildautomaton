import { logDebug } from '@plugins/harnesses/acp/util/log.js';
import type { AcpSessionTransport } from '@plugins/harnesses/acp/acp-session-transport.js';
import type { AcpEstablishedWire } from './establish-acp-session.js';

export async function newAcpSession(
  transport: AcpSessionTransport,
  cwd: string,
  mcpServers: unknown[],
  agentLabel: string,
  fromResult: (raw: unknown, sessionId: string) => AcpEstablishedWire,
): Promise<AcpEstablishedWire> {
  try {
    return fromNew(await transport.newSession({ cwd, mcpServers }), agentLabel, fromResult);
  } catch (err) {
    if (!mcpServers.length) throw err;
    logDebug(`[Agent] ${agentLabel} ACP session/new with MCP failed; retrying without`);
    return fromNew(await transport.newSession({ cwd, mcpServers: [] }), agentLabel, fromResult);
  }
}

function fromNew(
  raw: unknown,
  agentLabel: string,
  fromResult: (raw: unknown, sessionId: string) => AcpEstablishedWire,
): AcpEstablishedWire {
  const rec = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const sid = typeof rec.sessionId === 'string' ? rec.sessionId : '';
  if (!sid) throw new Error(`${agentLabel} ACP session/new did not return sessionId`);
  return fromResult(raw, sid);
}
