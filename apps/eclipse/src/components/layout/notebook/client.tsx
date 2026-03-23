'use client';

import Link from 'next/link';
import {
  createContext,
  type ReactNode,
  use,
  useMemo,
  useState,
} from 'react';
import { useSidebar } from '../sidebar/base';

// -- Layout context (nav transparency) --

export const LayoutContext = createContext<{
  isNavTransparent: boolean;
} | null>(null);

export function LayoutContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <LayoutContext
      value={useMemo(
        () => ({ isNavTransparent: false }),
        [],
      )}
    >
      {children}
    </LayoutContext>
  );
}

// -- Sidebar enabled (per-page control) --

export const SidebarEnabledContext = createContext<boolean>(true);

const SidebarEnabledSetterContext = createContext<
  (enabled: boolean) => void
>(() => {});

/**
 * Renders children only when the sidebar is enabled (layout + page).
 */
export function SidebarEnabledGate({ children }: { children: ReactNode }) {
  const enabled = use(SidebarEnabledContext);
  if (!enabled) return null;
  return <>{children}</>;
}

/**
 * Provider that merges layout sidebar.enabled with the page's choice.
 * Layout wraps content in this; DocsPage syncs via the setter
 * so a page can hide the sidebar.
 */
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

/**
 * Syncs page-level sidebar.enabled to the layout context.
 * Used inside DocsPage when a page wants to hide the sidebar.
 */
export function SidebarEnabledSync({ enabled }: { enabled: boolean }) {
  const setEnabled = use(SidebarEnabledSetterContext);
  if (!enabled) setEnabled(false);
  return null;
}

// -- Nav --

export function Nav() {
  const { setOpen } = useSidebar();

  return (
    <header className="fixed top-0 left-0 bottom-auto right-0 z-40 px-5 h-[3.25rem] flex flex-row items-center justify-between gap-6 bg-background-neutral/50 border-b border-stroke-neutral backdrop-blur-surface">
      <div className="flex flex-row items-center gap-3">
        <Link href="/" className="flex flex-row items-center justify-start gap-3">
          <div className="size-7 flex flex-row items-center justify-center gap-0 bg-background-neutral-reverse text-foreground-neutral-reverse rounded-square">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="size-4 fill-current">
              <g clipPath="url(#clip0_3559_19)">
                <path opacity="0.4" d="M10.1953 3.17813C13.0875 5.04844 15 8.30156 15 12C15 15.6984 13.0875 18.9469 10.1953 20.8172C10.7766 20.9344 11.3813 21 12 21C16.9688 21 21 16.9688 21 12C21 7.03125 16.9688 3 12 3C11.3813 3 10.7812 3.06094 10.1953 3.17813Z" className="fill-current" />
                <path d="M12 24C8.8174 24 5.76516 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12C0 8.8174 1.26428 5.76516 3.51472 3.51472C5.76516 1.26428 8.8174 0 12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76516 24 8.8174 24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24ZM12 3C11.3813 3 10.7812 3.06094 10.1953 3.17813C13.0875 5.04844 15 8.30156 15 12C15 15.6984 13.0875 18.9469 10.1953 20.8172C10.7766 20.9344 11.3813 21 12 21C16.9688 21 21 16.9688 21 12C21 7.03125 16.9688 3 12 3Z" className="fill-current" />
              </g>
              <defs>
              </defs>
            </svg>
          </div>

          <p className="font-medium text-sm text-foreground-neutral">Eclipse <span className="font-normal text-sm text-foreground-neutral-weak">by</span> Prisma</p>
        </Link>
      </div>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="md:hidden flex flex-row items-center justify-center size-7 text-foreground-neutral-weak hover:text-foreground-neutral transition-colors cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
}
