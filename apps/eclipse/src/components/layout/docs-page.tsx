import type { ComponentProps, ReactNode } from 'react';
import type { TOCItemType } from 'fumadocs-core/toc';
import { TOCProvider, TableOfContents } from '../toc';
import { DocsFooter } from './docs-footer';
import { SidebarEnabledSync } from './context';

export interface DocsPageProps {
  toc?: TOCItemType[];

  /**
   * Extend the page to fill all available space
   *
   * @defaultValue false
   */
  full?: boolean;

  /**
   * Control the docs layout sidebar from this page.
   * When `sidebar={{ enabled: false }}`, the sidebar is hidden for this page only.
   */
  sidebar?: { enabled?: boolean };

  children: ReactNode;
}

export function DocsPage({
  toc = [],
  full = false,
  sidebar: sidebarOpt,
  children,
}: DocsPageProps) {
  const tocEnabled = !full && toc.length > 0;

  const content = (
    <article>
      {sidebarOpt !== undefined && (
        <SidebarEnabledSync enabled={sidebarOpt.enabled !== false} />
      )}
      {children}
      <DocsFooter className="px-6 md:pl-[18.5rem] md:pr-12 pb-6 md:pb-12" />
    </article>
  );

  if (tocEnabled) {
    return <TOCProvider toc={toc}>{content}</TOCProvider>;
  }

  return content;
}

export function DocsHeader({ children, className, ...props }: ComponentProps<'header'>) {
  return (
    <header
      className={`px-6 md:pl-[18.5rem] md:pr-12 pt-[4.75rem] md:pt-[6.25rem] pb-6 md:pb-12 flex flex-col items-stretch justify-start gap-2 border-b border-stroke-neutral ${className ?? ''}`}
      {...props}
    >
      {children}
    </header>
  );
}

export function DocsTitle({ children, className, ...props }: ComponentProps<'h1'>) {
  return (
    <h1 className={`font-bold text-3xl text-foreground-neutral ${className ?? ''}`} {...props}>
      {children}
    </h1>
  );
}

export function DocsDescription({ children, className, ...props }: ComponentProps<'p'>) {
  if (!children) return null;

  return (
    <p className={`font-normal text-base text-foreground-neutral-weak ${className ?? ''}`} {...props}>
      {children}
    </p>
  );
}

export function DocsBody({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <section className="px-6 md:pl-[18.5rem] md:pr-12 py-6 md:py-12 flex flex-row items-stretch justify-start gap-12">
      <div className={`prose grow-1 min-w-0 ${className ?? ''}`} {...props}>
        {children}
      </div>
      <div className="grow-0 shrink-0 w-[15rem] hidden xl:block">
        <TableOfContents />
      </div>
    </section>
  );
}
