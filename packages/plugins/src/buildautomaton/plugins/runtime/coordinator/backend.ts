import type { CoordinatorContext, CoordinatorImplementation, CoordinatorStatus } from './types.js';
import { beginSession } from './begin-session.js';

export function createCoordinator(): CoordinatorImplementation {
  let bound: CoordinatorContext | undefined;
  let current: CoordinatorStatus = { status: 'idle' };
  return {
    bind(ctx) {
      bound = ctx;
    },
    status: () => current,
    async start(input) {
      if (!bound) return { status: 'idle' };
      return beginSession(bound, input, (next) => {
        current = next;
      });
    },
  };
}
