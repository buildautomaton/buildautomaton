import { useState } from 'react';
import { Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger } from '@buildautomaton/ui-runtime';
import type { Listing } from '../../types/listing.js';
import { ArtifactTabs } from './artifact-tabs.js';
import { SourceTree } from './source-tree.js';

export function ListingDetail(props: { listing: Listing; onBack: () => void }) {
  const [tab, setTab] = useState('artifacts');
  const listing = props.listing;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Button variant="ghost" size="sm" onClick={props.onBack}>
          Back
        </Button>
        <h2 className="text-sm font-semibold">{listing.name}</h2>
        <Badge>{listing.kind}</Badge>
      </div>
      {listing.plugins.length > 0 ? (
        <p className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
          Composition: {listing.plugins.join(', ')}
        </p>
      ) : null}
      <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1">
        <TabsList>
          <TabsTrigger value="artifacts">Details</TabsTrigger>
          <TabsTrigger value="source">Source</TabsTrigger>
        </TabsList>
        <TabsContent value="artifacts">
          <ArtifactTabs artifacts={listing.artifacts} />
        </TabsContent>
        <TabsContent value="source">
          <SourceTree files={listing.source} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
