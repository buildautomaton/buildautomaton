import type { McpToolDefinition } from '@plugins/work/host.js';
import { ASK_BUILDAUTOMATON_INTERVIEW_QUESTIONS } from './names.js';
import { ASK_BUILDAUTOMATON_INTERVIEW_DESCRIPTION } from './descriptions.js';
import { INTERVIEW_QUESTIONS_SCHEMA } from './questions-schema.js';
import { INTERVIEW_OUTPUT_SCHEMA } from './session-schemas.js';

export const ASK_BUILDAUTOMATON_INTERVIEW_QUESTIONS_DEFINITION: McpToolDefinition = {
  name: ASK_BUILDAUTOMATON_INTERVIEW_QUESTIONS,
  title: 'Ask interview questions on a draft',
  description: ASK_BUILDAUTOMATON_INTERVIEW_DESCRIPTION,
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    required: ['workId', 'questions'],
    properties: {
      workId: { type: 'string', description: 'Draft work id from ask_buildautomaton_what_to_build_next' },
      sessionId: {
        type: 'string',
        description:
          'Interview session handle from ask (sessionId or interviewSessionId in structuredContent).',
      },
      questions: INTERVIEW_QUESTIONS_SCHEMA,
    },
  },
  outputSchema: INTERVIEW_OUTPUT_SCHEMA,
};
