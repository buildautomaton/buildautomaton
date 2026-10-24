export type Scope =
  | { kind: 'all' }
  | { kind: 'user'; field: string }
  | { kind: 'list'; field: string; values: string[] };

export type Grant = {
  collection: string;
  read: boolean;
  actions: string[];
  scope: Scope;
};

export type AllowInput = {
  action: string;
  collections: string[];
  rows?: Record<string, unknown>[];
};

export type AllowResult = { ok: true } | { ok: false; error: string };

const READS = new Set(['get', 'list', 'query', 'count', 'collections']);

export function judge(input: {
  owner: boolean;
  grants: Grant[];
  userId: string;
  action: string;
  collections: string[];
  rows: Record<string, unknown>[];
}): AllowResult {
  if (input.owner) return { ok: true };
  if (!input.collections.length) return named(input.grants, input.action);
  for (const collection of input.collections) {
    const grant = findGrant(input.grants, collection);
    if (!grant) return { ok: false, error: `No grant for ${collection}` };
    const denied = denies(grant, input.action);
    if (denied) return { ok: false, error: denied };
    if (!input.rows.every((row) => inScope(grant.scope, input.userId, row))) {
      return { ok: false, error: `Rows are outside the grant for ${collection}` };
    }
  }
  return { ok: true };
}

export function visibleRows(
  grants: Grant[],
  owner: boolean,
  userId: string,
  collection: string,
  rows: Record<string, unknown>[],
): Record<string, unknown>[] {
  if (owner) return rows;
  const grant = findGrant(grants, collection);
  if (!grant?.read) return [];
  return rows.filter((row) => inScope(grant.scope, userId, row));
}

function named(grants: Grant[], action: string): AllowResult {
  const allowed = grants.some((grant) => grant.actions.includes(action) || grant.actions.includes('*'));
  return allowed ? { ok: true } : { ok: false, error: `Cannot ${action}` };
}

function findGrant(grants: Grant[], collection: string): Grant | undefined {
  return grants.find((grant) => grant.collection === collection || grant.collection === '*');
}

function denies(grant: Grant, action: string): string | null {
  if (READS.has(action)) return grant.read ? null : `Cannot read ${grant.collection}`;
  if (grant.actions.includes(action) || grant.actions.includes('*')) return null;
  return `Cannot ${action} on ${grant.collection}`;
}

export function inScope(scope: Scope, userId: string, row: Record<string, unknown>): boolean {
  if (scope.kind === 'all') return true;
  const value = row[scope.field];
  if (scope.kind === 'user') return value === userId;
  return scope.values.includes(String(value ?? ''));
}
