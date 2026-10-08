import { artifactPlugin } from './define.js';
import { mdFile } from './md-file.js';
import { mermaidMarkdown } from '@plugins/work/queue/artifacts/text-pages.js';
import { DATA_MODEL_ARTIFACT_SCHEMA } from '@plugins/work/work-tools/schema/diagrams.js';
import { parseDiagram } from '@plugins/work/work-tools/parse-parts.js';
import type { DataModelInput } from '@plugins/work/types/work/data-model.js';

export const dataModelArtifactPlugin = () =>
  artifactPlugin('artifact-data-model', {
    key: 'dataModel',
    description:
      'dataModel: Mermaid erDiagram/classDiagram plus highlights so changed entities, properties, and relationships paint green/yellow/red.',
    instructions:
      'Include dataModel whenever entities, fields, or relationships changed. Use real names and pass highlights for significant changes — summary alone is not enough.',
    schema: DATA_MODEL_ARTIFACT_SCHEMA,
    parse: parseDiagram,
    buildFiles: (payload, ctx) => {
      const model = payload as DataModelInput;
      const highlights = model.highlights?.length ? JSON.stringify(model.highlights) : undefined;
      return mdFile(
        'data-model',
        mermaidMarkdown(`${ctx.title} data model`, model.whatChanged, model.mermaid, highlights),
      );
    },
  });
