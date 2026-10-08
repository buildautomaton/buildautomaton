import { PanelSlot } from '../panel-slot.js';
import { NavSlot } from '../nav-slot.js';

export function AppShell() {
  return (
    <div className="relative flex h-full min-h-0 w-full">
      <NavSlot />
      <PanelSlot panel="main" className="min-h-0 min-w-0 flex-1 overflow-hidden bg-background" />
    </div>
  );
}
