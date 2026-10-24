# Workflows

`workflowsPlugin` (service id `workflows`) serves markdown stages to the agent. A workflow is a rough sequence of steps, not an executor.

```ts
import { workflowsPlugin } from '@buildautomaton/plugins';

workflowsPlugin({
  runtime,
  options: {
    workflows: [{ id: 'discover', title: 'Discover', steps: 'Search, then store the list.' }],
  },
})
```

Tool: `get_workflow`. Omit `id` for the overview. Pass `id` for one stage. Unknown ids return an error string.

On MCP `initialize`, the plugin adds instructions to call `get_workflow` before the data store or widgets. That text does not replace the session prompt.
