import type { FormEvent } from 'react';
import { Button, Input } from '@buildautomaton/ui-runtime';
import type { ListingKind } from '../../types/listing.js';

export function SearchBar(props: {
  query: string;
  kind: ListingKind | '';
  busy: boolean;
  onQuery: (value: string) => void;
  onKind: (value: ListingKind | '') => void;
}) {
  function submit(event: FormEvent) {
    event.preventDefault();
  }
  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2 border-b border-border p-4">
      <Input
        value={props.query}
        onChange={(event) => props.onQuery(event.target.value)}
        placeholder="Semantic phrase, e.g. work queue for agents"
      />
      <select
        value={props.kind}
        onChange={(event) => props.onKind(event.target.value as ListingKind | '')}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">All</option>
        <option value="plugin">Plugins</option>
        <option value="app">Apps</option>
      </select>
      <Button type="submit" size="sm" disabled={props.busy}>
        Search
      </Button>
    </form>
  );
}
