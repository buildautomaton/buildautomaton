import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@buildautomaton/ui-runtime';
import type { ListingArtifact } from '../../types/listing.js';
import { Markdown } from './markdown.js';

export function ArtifactTabs({ artifacts }: { artifacts: ListingArtifact[] }) {
  const [tab, setTab] = useState(artifacts[0]?.kind ?? 'description');
  if (artifacts.length === 0) return <p className="p-4 text-sm text-muted-foreground">No artifacts.</p>;
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        {artifacts.map((artifact) => (
          <TabsTrigger key={artifact.id} value={artifact.kind}>
            {artifact.title || artifact.kind}
          </TabsTrigger>
        ))}
      </TabsList>
      {artifacts.map((artifact) => (
        <TabsContent key={artifact.id} value={artifact.kind}>
          <Markdown text={artifact.files.map((file) => file.content).join('\n\n')} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
