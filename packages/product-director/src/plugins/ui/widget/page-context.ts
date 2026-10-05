export function pageFromLocation(search: string): string | null {
  const page = new URLSearchParams(search).get('page')?.trim();
  return page || null;
}

export function promptWithPage(prompt: string, page: string | null): string {
  if (!page) return prompt;
  return `${prompt}\n\nPage: ${page}`;
}
