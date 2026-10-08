/** Parsed agent model `select` option from an ACP capability probe. */
export type AgentModelSelectWire = {
  configId: string;
  options: Array<{ value: string; name: string }>;
  currentValue: string | null;
};

function looksLikeModelConfigOption(option: Record<string, unknown>): boolean {
  const category = option.category;
  if (category === 'model' || category === 'models') return true;
  const id = typeof option.id === 'string' ? option.id.toLowerCase() : '';
  if (id === 'model' || id.endsWith('_model') || id.includes('model')) return true;
  const name = typeof option.name === 'string' ? option.name.toLowerCase() : '';
  return name.includes('model') && !name.includes('mode');
}

function currentValue(raw: Record<string, unknown>): string | null {
  const value = typeof raw.currentValue === 'string' ? raw.currentValue.trim() : '';
  return value || null;
}

function parseSelectOptions(opts: unknown): Array<{ value: string; name: string }> | null {
  if (!Array.isArray(opts)) return null;
  const out: Array<{ value: string; name: string }> = [];
  for (const item of opts) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const value = typeof row.value === 'string' ? row.value : '';
    const name = typeof row.name === 'string' ? row.name : value;
    if (value) out.push({ value, name });
  }
  return out.length ? out : null;
}

function asSelect(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const option = raw as Record<string, unknown>;
  return option.type === 'select' ? option : null;
}

/**
 * Picks the model `select` from ACP `configOptions`.
 * Falls back to the largest select when the agent omits a model-like id.
 */
export function extractAgentModelSelectFromConfigOptions(
  configOptions: unknown[] | null | undefined,
): AgentModelSelectWire | null {
  if (!Array.isArray(configOptions) || configOptions.length === 0) return null;
  for (const raw of configOptions) {
    const option = asSelect(raw);
    if (!option || !looksLikeModelConfigOption(option)) continue;
    const opts = parseSelectOptions(option.options);
    if (!opts) continue;
    const id = typeof option.id === 'string' ? option.id.trim() : '';
    return { configId: id || 'model', options: opts, currentValue: currentValue(option) };
  }
  let best: AgentModelSelectWire | null = null;
  let bestLen = 0;
  for (const raw of configOptions) {
    const option = asSelect(raw);
    const opts = option ? parseSelectOptions(option.options) : null;
    if (!option || !opts || opts.length < 2 || opts.length <= bestLen) continue;
    bestLen = opts.length;
    const id = typeof option.id === 'string' ? option.id.trim() : '';
    best = { configId: id || 'config', options: opts, currentValue: currentValue(option) };
  }
  return best;
}
