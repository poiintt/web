'use client';

import {
  createContext,
  type ReactNode,
  use,
  useMemo,
  useState,
} from 'react';

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
  // Sync on render — setter is stable so this is safe
  if (!enabled) setEnabled(false);
  return null;
}
