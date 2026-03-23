import type { ReactNode } from 'react';
import { TableOfContents } from './toc';

export function Page({
  title,
  description,
  toc,
  children,
}: {
  title: string;
  description?: string;
  toc: { title: ReactNode; url: string; depth: number }[];
  children: ReactNode;
}) {
  return (
    <article>
      <header className="px-6 md:pl-[18.5rem] md:pr-12 pt-[4.75rem] md:pt-[6.25rem] pb-6 md:pb-12 flex flex-col items-stretch justify-start gap-2 border-b border-stroke-neutral">
        <h1 className="font-bold text-3xl text-foreground-neutral">{title}</h1>

        { description && (
          <p className="font-normal text-base text-foreground-neutral-weak">
            { description }
          </p>
        ) }
      </header>
      <section className="px-6 md:pl-[18.5rem] md:pr-12 py-6 md:py-12 flex flex-row items-stretch justify-start gap-12">
        <div className="grow-1">
          <div className="prose">
            { children }
          </div>
        </div>
        <div className="grow-0 shrink-0 w-[15rem] hidden xl:block">
          <TableOfContents items={toc} />
        </div>
      </section>
    </article>
  );
}
