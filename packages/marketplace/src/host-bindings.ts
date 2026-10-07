import {
  isD1Database,
  isDoSqlNamespace,
  isR2Bucket,
  type AnyFileStore,
  type AnySqlStore,
  type D1DatabaseLike,
  type DoSqlNamespace,
  type R2BucketLike,
  type SqlStoreOpener,
} from '@buildautomaton/plugins/worker';

export type MarketplaceHostBindings = {
  listings: D1DatabaseLike | AnySqlStore;
  plugins: DoSqlNamespace | SqlStoreOpener;
  files: R2BucketLike | AnyFileStore;
};

export function listingsIsD1(value: MarketplaceHostBindings['listings']): value is D1DatabaseLike {
  return isD1Database(value);
}

export function pluginsIsNamespace(value: MarketplaceHostBindings['plugins']): value is DoSqlNamespace {
  return isDoSqlNamespace(value);
}

export function filesIsR2(value: MarketplaceHostBindings['files']): value is R2BucketLike {
  return isR2Bucket(value);
}
