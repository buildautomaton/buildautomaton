import type { AnyFileStore, AnySqlStore, SqlStoreOpener } from '@buildautomaton/plugins';

export type MarketplaceStores = {
  listings: AnySqlStore;
  plugins: SqlStoreOpener;
  files: AnyFileStore;
};
