import type { AcpEngine, LogFn, SessionImplementation } from '@buildautomaton/runtime';
import type { WorkItem } from '@/types/work/records.js';

export type CoordinatorStatus = {
  status: 'idle' | 'waiting' | 'running' | 'failed';
  sessionId?: string;
  harness?: string;
  error?: string;
};

export type CoordinatorContext = {
  engine: AcpEngine;
  backend: SessionImplementation;
  cwd: string;
  log: LogFn;
  extras: Record<string, unknown>;
};

export type StartSessionInput = {
  prompt: string;
  project?: string;
};

export type StartSessionResult = CoordinatorStatus & { work?: WorkItem };

export type CoordinatorImplementation = {
  bind(ctx: CoordinatorContext): void;
  start(input: StartSessionInput): Promise<StartSessionResult>;
  status(): CoordinatorStatus;
};
