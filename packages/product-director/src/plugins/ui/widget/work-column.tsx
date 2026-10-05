import { Sparkles } from 'lucide-react';
import { ColumnHeader } from '@buildautomaton/ui-runtime';
import { ProjectTabs } from '../work/project-tabs.js';
import { MixedList } from './mixed-list.js';
import { QueuePanel } from './queue-panel.js';
import { WidgetClose } from './widget-close.js';
import { WidgetComposer } from './widget-composer.js';

export function WorkColumn({ cwd }: { cwd: string }) {
  return (
    <section className="flex h-full min-h-0 flex-col bg-background text-foreground">
      <ColumnHeader title="Product director" icon={Sparkles} trailing={<WidgetClose />} />
      <p className="truncate border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground" title={cwd}>
        {cwd}
      </p>
      <div className="border-b border-border px-2">
        <ProjectTabs />
      </div>
      <WidgetComposer />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <MixedList />
      </div>
      <QueuePanel />
    </section>
  );
}
