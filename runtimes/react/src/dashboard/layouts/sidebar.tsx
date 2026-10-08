import { useState } from 'react';
import { PanelSlot } from '../panel-slot.js';
import { NavSlot } from '../nav-slot.js';
import { sidebarPaneClass } from '../chrome.js';
import { useUiHost } from '../host.js';
import { readSidebarOpen, writeSidebarOpen } from './sidebar-open.js';
import { SidebarTab } from './sidebar-tab.js';

export function SidebarShell() {
  const { surfacesIn } = useUiHost();
  const [open, setOpen] = useState(readSidebarOpen);
  const surfaces = surfacesIn('sidebar');
  const label = surfaces[0]?.title ?? 'Sidebar';

  function toggle() {
    setOpen((current) => {
      const next = !current;
      writeSidebarOpen(next);
      return next;
    });
  }

  return (
    <div className="relative flex h-full min-h-0 w-full overflow-hidden">
      <NavSlot />
      <PanelSlot panel="main" className="min-h-0 min-w-0 flex-1 overflow-hidden bg-background" />
      <PanelSlot panel="sidebar" id="ui-sidebar" className={open ? sidebarPaneClass : 'hidden'} />
      {surfaces.length > 0 ? <SidebarTab open={open} label={label} onToggle={toggle} /> : null}
    </div>
  );
}
