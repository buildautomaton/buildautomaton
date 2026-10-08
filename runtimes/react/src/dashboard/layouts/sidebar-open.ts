const KEY = 'ui-sidebar-open';

export function readSidebarOpen(): boolean {
  try {
    const value = localStorage.getItem(KEY);
    if (value === '0') return false;
    if (value === '1') return true;
  } catch {
    /* ignore quota / private mode */
  }
  return true;
}

export function writeSidebarOpen(open: boolean): void {
  try {
    localStorage.setItem(KEY, open ? '1' : '0');
  } catch {
    /* ignore quota / private mode */
  }
}
