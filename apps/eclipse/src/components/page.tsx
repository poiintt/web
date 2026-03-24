'use client';

import type { ComponentProps, ReactNode } from 'react';
import type { TOCItemType } from 'fumadocs-core/toc';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, use, useMemo, useState } from 'react';
import { useFooterItems } from '@fumadocs/base-ui/utils/use-footer-items';
import { TOCProvider, TableOfContents } from './toc';

// -- Sidebar enabled sync (per-page sidebar control) --

const SidebarEnabledSetterContext = createContext<(enabled: boolean) => void>(() => {});
export const SidebarEnabledContext = createContext<boolean>(true);

export function SidebarEnabledFromPageProvider({
  layoutEnabled,
  children,
}: {
  layoutEnabled: boolean;
  children: ReactNode;
}) {
  const [pageEnabled, setPageEnabled] = useState(true);
  const effective = layoutEnabled && pageEnabled;
  const setter = useMemo(
    () => (enabled: boolean) => setPageEnabled(enabled),
    [],
  );

  return (
    <SidebarEnabledSetterContext.Provider value={setter}>
      <SidebarEnabledContext.Provider value={effective}>
        {children}
      </SidebarEnabledContext.Provider>
    </SidebarEnabledSetterContext.Provider>
  );
}

function SidebarEnabledSync({ enabled }: { enabled: boolean }) {
  const setEnabled = use(SidebarEnabledSetterContext);
  if (!enabled) setEnabled(false);
  return null;
}

// -- DocsPage --

export interface DocsPageProps {
  toc?: TOCItemType[];
  full?: boolean;
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

// -- Composable page components --

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

// -- Footer --

function DocsFooter({ className }: { className?: string }) {
  const footerList = useFooterItems();
  const pathname = usePathname();

  const { previous, next } = useMemo(() => {
    const idx = footerList.findIndex((item) => item.url === pathname);
    if (idx === -1) return {};
    return {
      previous: footerList[idx - 1],
      next: footerList[idx + 1],
    };
  }, [footerList, pathname]);

  if (!previous && !next) return null;

  return (
    <nav
      className={`mt-12 grid gap-3 ${previous && next ? 'grid-cols-2' : 'grid-cols-1'} ${className ?? ''}`}
    >
      {previous && (
        <Link
          href={previous.url}
          className="flex flex-col gap-1 p-4 rounded-square border border-stroke-neutral hover:bg-background-neutral transition-colors"
        >
          <span className="text-xs text-foreground-neutral-weak">Previous</span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground-neutral">
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {previous.name}
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={next.url}
          className={`flex flex-col gap-1 p-4 rounded-square border border-stroke-neutral hover:bg-background-neutral transition-colors text-end ${!previous ? 'col-start-1' : ''}`}
        >
          <span className="text-xs text-foreground-neutral-weak">Next</span>
          <span className="flex items-center justify-end gap-1.5 text-sm font-medium text-foreground-neutral">
            {next.name}
            <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      )}
    </nav>
  );
}
