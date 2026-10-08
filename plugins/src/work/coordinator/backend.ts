import type { CoordinatorContext, CoordinatorImplementation, CoordinatorStatus } from './types.js';
import { beginSession } from './begin-session.js';
import { continueSession } from './continue-session.js';

export function createCoordinator(): CoordinatorImplementation {
  let bound: CoordinatorContext | undefined;
  let current: CoordinatorStatus = { status: 'idle' };
  const onStatus = (next: CoordinatorStatus) => {
    current = next;
  };
  return {
    bind(ctx) {
      bound = ctx;
    },
    status: () => current,
    async start(input) {
      if (!bound) return { status: 'idle' };
      return beginSession(bound, input, onStatus);
    },
    async continue(input) {
      if (!bound) return { status: 'idle' };
      return continueSession(bound, input, onStatus);
    },
  };
}
