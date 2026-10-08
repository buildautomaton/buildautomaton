import { marked } from 'marked';

marked.use({ gfm: true, breaks: false });

const mdClass =
  'text-sm leading-relaxed text-foreground [&_a]:underline [&_code]:font-mono [&_code]:text-xs [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5';

export function MarkdownBody({ content, liveTail }: { content: string; liveTail?: boolean }) {
  const html = marked.parse(content, { async: false }) as string;
  return (
    <div>
      <div className={mdClass} dangerouslySetInnerHTML={{ __html: html }} />
      {liveTail ? (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-foreground align-middle" aria-hidden />
      ) : null}
    </div>
  );
}
