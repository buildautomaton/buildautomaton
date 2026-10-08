const MARK = 'User request:';

export function userRequestText(prompt: string): string {
  const idx = prompt.lastIndexOf(MARK);
  const text = idx >= 0 ? prompt.slice(idx + MARK.length) : prompt;
  return text.trim();
}

export function sessionTitle(prompt: string): string {
  const line = userRequestText(prompt).split('\n')[0]?.trim() || 'Session';
  return line.length > 80 ? `${line.slice(0, 77)}...` : line;
}
