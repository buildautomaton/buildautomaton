# Security

`securityPlugin` (service id `security`) owns users, roles, and grants for one workspace. The data store asks it before every read and named write. It does not run mutations.

```ts
import { securityPlugin } from '@buildautomaton/plugins';

securityPlugin({ runtime, options: { workspaceId } })
```

It uses the shared `work` SQL schema. Tables are `sec_user`, `sec_role`, `sec_member`, `sec_grant`, and `sec_actor`. List it after a SQL store plugin.

The first use seeds user `owner` on role `owner`. That role covers every collection and every mutation. `workspaceId` defaults to `local`. [Local CLI](../local-cli/) app mode passes the working directory.

A role is a reusable bundle of grants. A grant names:

| Field | Meaning |
| --- | --- |
| `collection` | Collection name, or `*` |
| `read` | Whether `get`, `list`, `query`, `count`, and `collections` are allowed |
| `actions` | Mutation names and write actions, or `*` |
| `scope` | Which rows the grant covers |

Scope is `{ kind: 'all' }`, `{ kind: 'user', field }` (the field must equal the user id), or `{ kind: 'list', field, values }`.

The signed-in user is the actor. An agent uses that user's grants. `setActor(userId)` switches the actor. `invite` adds a user to a role. `addRole` stores a role and its grants.

`allow({ action, collections, rows })` is the check. It rejects the call when no grant lists that action on each collection, or when a row sits outside the scope. A rejected call does not write. `filter` drops rows a read is not allowed to see. `can` is the same check with no rows, so a widget can hide a button. The data store still rejects the action if it arrives. A mutation cannot widen the caller's grant.
