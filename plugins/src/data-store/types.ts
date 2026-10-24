export type FieldType = 'string' | 'number' | 'boolean';

export type FieldDef = { name: string; type: FieldType; label?: string; help?: string };

export type DataRecord = { id: string; [key: string]: unknown };

export type Collection = {
  name: string;
  typeName: string;
  fields: FieldDef[];
  records: DataRecord[];
};

export type StoreData = { collections: Record<string, Collection> };

export type ActionInput = {
  action?: string;
  collection?: string;
  typeName?: string;
  fields?: { name?: string; type?: string; label?: string; help?: string }[];
  records?: Record<string, unknown>[];
  record?: Record<string, unknown>;
  id?: string;
  patch?: Record<string, unknown>;
  where?: Record<string, unknown>;
  scoreFields?: string[];
  high?: number;
  mid?: number;
};

export type ActionResult =
  | {
      ok: true;
      collection?: string;
      typeName?: string;
      count?: number;
      changed?: number;
      fields?: FieldDef[];
      records?: DataRecord[];
      record?: DataRecord | null;
      collections?: { name: string; typeName: string; count: number }[];
    }
  | { ok: false; error: string };
