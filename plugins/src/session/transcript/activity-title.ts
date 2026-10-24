import type { TranscriptActivityItem } from './block.js';

export function activityTitle(items: TranscriptActivityItem[]): string {
  const tools = items.filter((item) => item.kind === 'tool').length;
  const thoughts = items.filter((item) => item.kind === 'thought').length;
  const permissions = items.filter((item) => item.kind === 'permission').length;
  const parts: string[] = [];
  if (tools) parts.push(tools === 1 ? '1 tool call' : `${tools} tool calls`);
  if (permissions) parts.push(permissions === 1 ? '1 permission' : `${permissions} permissions`);
  if (thoughts === 1) parts.push('reasoning');
  else if (thoughts > 1) parts.push(`${thoughts} reasoning steps`);
  return parts.join(' and ') || 'Activity';
}
