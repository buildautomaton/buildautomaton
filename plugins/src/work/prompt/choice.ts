export const HARNESS_KEY = 'ba-prompt-harness';
export const MODEL_KEY = 'ba-prompt-model';

export type ChoiceStore = {
  get(key: string): string | null;
  set(key: string, value: string): void;
};

export type ChoiceAgent = {
  type: string;
  displayName: string;
  detected: boolean;
  models: { id: string; label: string }[];
  modelsPending?: boolean;
};

export type PromptChoice = { harness: string; model: string };

export function resolveChoice(store: ChoiceStore, agents: ChoiceAgent[], lockHarness?: string): PromptChoice {
  const detected = agents.filter((agent) => agent.detected);
  const saved = store.get(HARNESS_KEY);
  const harness = lockHarness
    ? lockHarness
    : detected.some((agent) => agent.type === saved)
      ? (saved ?? '')
      : (detected[0]?.type ?? '');
  const agent = agents.find((item) => item.type === harness);
  const models = agent?.models ?? [];
  const savedModel = store.get(MODEL_KEY) ?? '';
  const model = agent?.modelsPending
    ? savedModel
    : savedModel && models.some((item) => item.id === savedModel)
      ? savedModel
      : '';
  return { harness, model };
}

export function writeChoice(store: ChoiceStore, choice: PromptChoice): void {
  store.set(HARNESS_KEY, choice.harness);
  store.set(MODEL_KEY, choice.model);
}

export function browserChoiceStore(): ChoiceStore {
  return {
    get: (key) => (typeof localStorage === 'undefined' ? null : localStorage.getItem(key)),
    set: (key, value) => localStorage.setItem(key, value),
  };
}
