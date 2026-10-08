import type { BuildAutomatonSetup } from './setup-status.js';

const TTL_MS = 30_000;

type Flight = { key: string; gen: number; promise: Promise<BuildAutomatonSetup> };

let entry: { key: string; at: number; setup: BuildAutomatonSetup } | null = null;
let flight: Flight | null = null;
let generation = 0;

export function clearSetupCache(): void {
  generation += 1;
  entry = null;
  flight = null;
}

export function dedupeSetup(key: string, load: () => Promise<BuildAutomatonSetup>): Promise<BuildAutomatonSetup> {
  if (entry && entry.key === key && Date.now() - entry.at < TTL_MS) return Promise.resolve(entry.setup);
  if (flight && flight.key === key && flight.gen === generation) return flight.promise;
  const gen = generation;
  const promise = load()
    .then((setup) => {
      if (gen === generation) entry = { key, at: Date.now(), setup };
      return setup;
    })
    .finally(() => {
      if (flight?.promise === promise) flight = null;
    });
  flight = { key, gen, promise };
  return promise;
}
