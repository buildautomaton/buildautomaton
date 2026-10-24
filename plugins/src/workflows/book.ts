export type WorkflowStage = { id: string; title?: string; steps: string };

export type WorkflowBook = { get(id?: string): string };

export function createWorkflowBook(stages: WorkflowStage[]): WorkflowBook {
  return {
    get(id?: string) {
      if (!id || id === 'overview') return overview(stages);
      const stage = stages.find((item) => item.id === id);
      if (!stage) return `Unknown workflow: ${id}`;
      return `# ${stage.title ?? stage.id}\n\n${stage.steps}`;
    },
  };
}

function overview(stages: WorkflowStage[]): string {
  if (!stages.length) return 'No workflows are configured. Pass id to get_workflow when stages are added.';
  const lines = stages.map((stage) => `- ${stage.id}: ${stage.title ?? stage.steps.split('\n')[0]}`);
  return `# Workflows\n\nCall get_workflow with an id for one stage.\n\n${lines.join('\n')}`;
}
