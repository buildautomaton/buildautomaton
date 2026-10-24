export type McpToolInputSchema = Record<string, unknown>;

export type McpToolDefinition = {
  name: string;
  title?: string;
  description: string;
  inputSchema: McpToolInputSchema;
  /** Optional JSON Schema for structuredContent on tool results (MCP state handles, etc.). */
  outputSchema?: McpToolInputSchema;
  _meta?: Record<string, unknown>;
};

export type McpResource = {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  text?: string;
  _meta?: Record<string, unknown>;
};

export type McpToolCallResult = {
  content: Array<{ type: 'text'; text: string }>;
  /** Machine-readable result; use for explicit state handles the model must thread forward. */
  structuredContent?: unknown;
  _meta?: Record<string, unknown>;
  isError?: boolean;
};
