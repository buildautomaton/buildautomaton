const KEY = 'ui-widget-open';

export function readWidgetOpen(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function writeWidgetOpen(open: boolean): void {
  try {
    localStorage.setItem(KEY, open ? '1' : '0');
  } catch {
    /* ignore quota / private mode */
  }
}
