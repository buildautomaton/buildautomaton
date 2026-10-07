import { DurableObject } from 'cloudflare:workers';
import { createDoSqlRpc, type SqlBind } from '@buildautomaton/plugins/worker';

/** One Durable Object per marketplace listing: versions and artifact metadata. */
export class MarketplacePluginDO extends DurableObject {
  private rpc() {
    return createDoSqlRpc(this.ctx.storage);
  }

  sqlExec(sql: string) {
    return this.rpc().sqlExec(sql);
  }

  sqlRun(sql: string, params: SqlBind[] = []) {
    return this.rpc().sqlRun(sql, params);
  }

  sqlAll(sql: string, params: SqlBind[] = []) {
    return this.rpc().sqlAll(sql, params);
  }

  sqlGet(sql: string, params: SqlBind[] = []) {
    return this.rpc().sqlGet(sql, params);
  }
}
