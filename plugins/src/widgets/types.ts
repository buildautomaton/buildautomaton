export type WidgetMode = 'table' | 'score' | 'cards' | 'form';

export type WidgetField = { name: string; type?: string; label?: string; help?: string };

export type WidgetDef = {
  id: string;
  title: string;
  mode: WidgetMode;
  collection: string;
  output: string;
  fields?: WidgetField[];
  actions?: string[];
};
