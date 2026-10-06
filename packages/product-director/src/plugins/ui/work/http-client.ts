import type {
  AnswerQuestionsResult,
  ArtifactSummary,
  WorkArtifact,
  WorkClient,
  WorkItem,
  WorkPatch,
} from './types.js';
import { readJsonResponse as json } from './http-json.js';
import { startDirectorSession } from './start-session-client.js';

export type HttpWorkClientOptions = {
  base?: string;
  workPath?: string;
  artifactsPath?: string;
};

export function createHttpWorkClient(options: HttpWorkClientOptions | string = ''): WorkClient {
  const opts = typeof options === 'string' ? { base: options } : options;
  const base = opts.base ?? '';
  const workPath = opts.workPath ?? '/api/work';
  const artifactsPath = opts.artifactsPath ?? '/api/artifacts';
  return {
    listWork: () => json<WorkItem[]>(fetch(`${base}${workPath}`)),
    addWork: (input) =>
      json<WorkItem>(
        fetch(`${base}${workPath}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(input),
        }),
      ),
    startSession: (input) => startDirectorSession(base, input),
    updateWork: (id, patch: WorkPatch) =>
      json<WorkItem | null>(
        fetch(`${base}${workPath}/${id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(patch),
        }),
      ),
    renameProject: (from, to) =>
      json<void>(
        fetch(`${base}${workPath}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ from, to }),
        }),
      ),
    deleteWork: (id) => json<void>(fetch(`${base}${workPath}/${id}`, { method: 'DELETE' })),
    listArtifacts: (workId) =>
      json<ArtifactSummary[]>(fetch(workId ? `${base}${workPath}/${workId}/artifacts` : `${base}${artifactsPath}`)),
    getArtifact: (id) => json<WorkArtifact | null>(fetch(`${base}${artifactsPath}/${id}`)),
    updateArtifact: (id, patch) =>
      json<WorkArtifact | null>(
        fetch(`${base}${artifactsPath}/${id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(patch),
        }),
      ),
    answerQuestions: async (artifactId, answers) => {
      const result = await json<AnswerQuestionsResult | WorkItem[] | undefined>(
        fetch(`${base}${artifactsPath}/${artifactId}/answers`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(answers),
        }),
      );
      if (Array.isArray(result)) return { queued: result, removed: [] };
      return { queued: result?.queued ?? [], removed: result?.removed ?? [] };
    },
    answerWorkQuestions: (workId, answers) =>
      json<WorkItem | null>(
        fetch(`${base}${workPath}/${workId}/answers`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(answers),
        }),
      ),
  };
}
