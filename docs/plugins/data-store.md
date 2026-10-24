# Data store

`dataStorePlugin` (service id `data-store`) owns one workspace store: named collections and named mutations. It does not decide who is allowed. It asks the [security](./security.md) plugin.

```ts
import { dataStorePlugin } from '@buildautomaton/plugins';

dataStorePlugin({
  runtime,
  options: {
    workspaceId,
    mutations: [{ action: 'confirm', source }],
  },
})
```

It uses the shared `work` SQL schema. Tables are `app_collection` and `app_record`, separate from the work queue and from `harness_session`. List it after a SQL store. Without security, every call is denied.

## Collection actions

Tool: `run_data_store_action`.

Actions: `define`, `insert`, `upsert`, `replace`, `update`, `remove`, `get`, `list`, `query`, `count`, `clear`, `score`, `collections`.

Field types are `string`, `number`, and `boolean`. `define` takes `collection`, `typeName`, and `fields`. Writes take `records`, `record`, `patch`, `id`, or `where`. A successful result includes `ok`, `collection`, `typeName`, `count`, and sometimes `records`. Reads are filtered to the actor's scope.

## Mutations

Tool: `run_mutation`, with `action` and `args`.

Each mutation is source that defines `function mutate(store, action)`. Collections are arrays on the store, such as `store.prospects`. `action.name` is the mutation name. `action.args` holds strings, numbers, and booleans.

The plugin checks the grant, runs the function, then checks the rows it wrote. A rejected grant or a thrown function leaves the store unchanged.
