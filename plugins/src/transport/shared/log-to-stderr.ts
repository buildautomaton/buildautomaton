import type { LogFn } from '@buildautomaton/runtime';
/** Lifecycle lines for MCP/remote (always stderr; stdout is the JSON-RPC wire). */
export const logToStderr: LogFn = (line) => {
  process.stderr.write(`${line}\n`);
};
