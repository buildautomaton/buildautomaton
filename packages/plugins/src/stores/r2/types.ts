export type R2ObjectLike = {
  text(): Promise<string>;
};

export type R2ListResult = {
  objects: { key: string }[];
};

/** Minimal R2 surface so the runtime does not depend on workers-types. */
export type R2BucketLike = {
  get(key: string): Promise<R2ObjectLike | null>;
  put(key: string, value: string): Promise<unknown>;
  delete(key: string): Promise<unknown>;
  list(opts?: { prefix?: string }): Promise<R2ListResult>;
};

export function isR2Bucket(value: unknown): value is R2BucketLike {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as R2BucketLike).put === 'function' &&
      typeof (value as R2BucketLike).get === 'function' &&
      !('write' in value),
  );
}
