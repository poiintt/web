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
    <header className="px-6 md:pl-[18.5rem] md:pr-12 pt-[4.75rem] md:pt-[6.25rem] pb-6 md:pb-12 flex flex-row items-stretch justify-start gap-12 border-b last:border-b-none border-stroke-neutral">
      <div className="grow-1 flex flex-col items-stretch gap-2">
        {children}
      </div>
      <div className="grow-0 shrink-0 w-[15rem] hidden xl:block">

      </div>
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
    <section className="px-6 md:pl-[18.5rem] md:pr-12 py-6 md:py-12 flex flex-row items-stretch justify-start gap-12 border-b last:border-b-none border-stroke-neutral">
      <div className="grow-1">
        <div className="prose">{children}</div>
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
    <footer className="p-6 md:pl-[18.5rem] md:pr-12 md:py-12 flex flex-row items-stretch justify-start gap-12 border-b last:border-b-0 border-stroke-neutral">
      <div className="grow-1 flex flex-row items-stretch justify-end">
        {previous && (
          <Link href={previous.url} className="basis-1/2 flex flex-col items-start justify-start gap-1">
            <span className="type-text-sm text-foreground-neutral-weak">Previous</span>
            <span className="type-text-md text-foreground-neutral">
              { previous.name }
            </span>
          </Link>
        )}

        {next && (
          <Link href={next.url} className="basis-1/2 flex flex-col items-end justify-start gap-1">
            <span className="type-text-sm text-foreground-neutral-weak">Next</span>
            <span className="type-text-md text-foreground-neutral">
              { next.name }
            </span>
          </Link>
        )}
      </div>
      <div className="grow-0 shrink-0 w-[15rem] hidden xl:block"></div>
    </footer>
  );
}
