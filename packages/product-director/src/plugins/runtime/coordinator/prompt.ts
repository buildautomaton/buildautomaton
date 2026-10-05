export const SESSION_MARK = '[director-session]';

export function buildSessionPrompt(userPrompt: string, sessionId: string, project?: string): string {
  const projectLine = project?.trim() ? `project: ${project.trim()}` : 'project: (use a short project name)';
  return `${SESSION_MARK}
You have product director MCP tools. Implement the user's request.

sessionId: ${sessionId}
${projectLine}

When the work is done, call tell_product_director_what_was_built with this sessionId, project, and artifacts. Do not invent a new sessionId. Do not call ask_product_director_what_to_build_next — this session already has work.

User request:
${userPrompt}`;
}
