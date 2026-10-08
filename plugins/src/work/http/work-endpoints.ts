import { HTTP_DEFAULT_WORK_ROOT, type TransportEndpoint } from '@plugins/work/host.js';

export function workHttpEndpoints(
  plugin: string,
  root = HTTP_DEFAULT_WORK_ROOT,
  routes?: Record<string, string>,
): TransportEndpoint[] {
  return [{ path: root, plugin, routes }];
}
