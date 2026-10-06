import type { MinionEvent, NotifierHub } from '@plugins/tools/tools/notify.js';
export function emitMinionEvent(notifier: NotifierHub | undefined, event: MinionEvent): void {
  notifier?.notify(event);
}
