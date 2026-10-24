import type { AllowInput } from '@plugins/security/allow.js';

export type StoreGate = {
  allow(input: AllowInput): Promise<{ ok: true } | { ok: false; error: string }>;
  filter(collection: string, rows: Record<string, unknown>[]): Promise<Record<string, unknown>[]>;
  can(action: string, collection: string): Promise<boolean>;
};

export const closedGate: StoreGate = {
  allow: async () => ({ ok: false, error: 'Security plugin is required' }),
  filter: async () => [],
  can: async () => false,
};

export function gateFrom(extras: Record<string, unknown>): StoreGate {
  const security = extras.security;
  if (!security || typeof security !== 'object') return closedGate;
  const candidate = security as Partial<StoreGate>;
  if (!candidate.allow || !candidate.filter || !candidate.can) return closedGate;
  return candidate as StoreGate;
}
