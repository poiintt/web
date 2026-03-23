'use client';

import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type RefObject,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { usePathname } from 'fumadocs-core/framework';
import { useMediaQuery } from 'fumadocs-core/utils/use-media-query';
import scrollIntoView from 'scroll-into-view-if-needed';

type Mode = 'drawer' | 'full';

interface SidebarContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  closeOnRedirect: RefObject<boolean>;
  defaultOpenLevel: number;
  prefetch?: boolean;
  mode: Mode;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const FolderContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  depth: number;
} | null>(null);

export function useSidebar(): SidebarContextValue {
  const ctx = use(SidebarContext);
  if (!ctx) throw new Error('Missing SidebarContext, wrap in <DocsLayout />.');
  return ctx;
}

export function useFolder() {
  return use(FolderContext);
}

export function useFolderDepth() {
  return use(FolderContext)?.depth ?? 0;
}

export interface SidebarProviderProps {
  defaultOpenLevel?: number;
  prefetch?: boolean;
  children?: ReactNode;
}

export function SidebarProvider({
  defaultOpenLevel = 0,
  prefetch,
  children,
}: SidebarProviderProps) {
  const closeOnRedirect = useRef(true);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const mode: Mode = useMediaQuery('(width < 768px)') ? 'drawer' : 'full';

  useOnChange(pathname, () => {
    if (closeOnRedirect.current) {
      setOpen(false);
    }
    closeOnRedirect.current = true;
  });

  return (
    <SidebarContext
      value={useMemo(
        () => ({
          open,
          setOpen,
          collapsed,
          setCollapsed,
          closeOnRedirect,
          defaultOpenLevel,
          prefetch,
          mode,
        }),
        [open, collapsed, defaultOpenLevel, prefetch, mode],
      )}
    >
      {children}
    </SidebarContext>
  );
}

/**
 * Sidebar shell — renders backdrop (mobile) + aside panel.
 * Keeps Eclipse's visual design: floating card with rounded corners.
 */
export function SidebarContent({
  banner,
  footer,
  children,
}: {
  banner?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { open, setOpen, mode } = useSidebar();

  return (
    <>
      {/* Backdrop overlay — mobile only */}
      {mode === 'drawer' && (
        <div
          className={`fixed inset-0 z-40 bg-background-default/50 backdrop-blur-surface transition-opacity md:hidden ${
            open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="nd-sidebar"

        className={`fixed top-2 md:top-[3.75rem] left-2 bottom-2 right-auto z-50 w-[15rem] flex flex-col items-stretch justify-start bg-background-default border border-stroke-neutral rounded-square-high shadow-box overflow-hidden transition-transform duration-150 ${
          open
            ? 'translate-x-0'
            : '-translate-x-[calc(100%+0.5rem)] md:translate-x-0'
        }`}
      >
        {banner && (
          <div className="grow-0 p-3 flex flex-col items-stretch justify-start gap-3 bg-background-default/50 border-b last:border-b-none border-stroke-neutral backdrop-blur-surface-low">
            {banner}
          </div>
        )}
        <div className="grow-1 p-3 flex flex-col items-stretch justify-start gap-3 bg-background-default border-b last:border-b-none border-stroke-neutral overflow-y-scroll no-scrollbar">
          {children}
        </div>
        {footer && (
          <div className="grow-0 p-3 flex flex-col items-stretch justify-start gap-3 bg-background-default/50 border-t border-stroke-neutral">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}

/**
 * Sidebar folder — manages open/close state with depth tracking.
 * Matches docs' SidebarFolder pattern with FolderContext.
 */
export function SidebarFolder({
  defaultOpen: defaultOpenProp,
  active = false,
  children,
}: {
  active?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const { defaultOpenLevel } = useSidebar();
  const depth = useFolderDepth() + 1;
  const defaultOpen = active || (defaultOpenProp ?? defaultOpenLevel >= depth);
  const [open, setOpen] = useState(defaultOpen);

  useOnChange(defaultOpen, (v) => {
    if (v) setOpen(v);
  });

  return (
    <FolderContext value={useMemo(() => ({ open, setOpen, depth }), [depth, open])}>
      <li>{children}</li>
    </FolderContext>
  );
}

/**
 * Sidebar folder trigger button — toggles the folder open/closed.
 */
export function SidebarFolderTrigger({ children }: { children: ReactNode }) {
  const { open, setOpen } = useFolder()!;

  return (
    <button
      onClick={() => setOpen(!open)}
      className={`w-full px-2 h-7 flex flex-row items-center justify-between gap-2 font-medium text-sm rounded-square transition-all duration-50 ${
        open
          ? 'bg-background-neutral hover:bg-background-neutral-strong text-foreground-neutral'
          : 'bg-background-default hover:bg-background-neutral text-foreground-neutral'
      }`}
    >
      {children}
      <svg
        className={`h-3 w-3 transition-transform ${open ? 'rotate-90' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

/**
 * Sidebar folder content — only renders children when folder is open.
 */
export function SidebarFolderContent({ children }: { children: ReactNode }) {
  const { open } = useFolder()!;
  if (!open) return null;

  return (
    <ul className="my-1 pl-3 flex flex-col items-stretch justify-center gap-1">
      {children}
    </ul>
  );
}

/**
 * Sidebar folder link — a clickable link that also toggles the folder.
 * Used when a folder has an index page.
 */
export function SidebarFolderLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const { open, setOpen } = useFolder()!;
  const { prefetch } = useSidebar();
  const pathname = usePathname();
  const active = pathname === href;
  const ref = useRef<HTMLAnchorElement>(null);

  useAutoScroll(active, ref);

  return (
    <Link
      ref={ref}
      href={href}
      data-active={active}
      onClick={(e) => {
        if (
          e.target instanceof Element &&
          e.target.matches('[data-icon], [data-icon] *')
        ) {
          setOpen(!open);
          e.preventDefault();
        } else {
          setOpen(active ? !open : true);
        }
      }}
      className={`w-full px-2 h-7 flex flex-row items-center justify-between gap-2 font-medium text-sm rounded-square transition-all duration-50 ${
        active
          ? 'bg-background-neutral hover:bg-background-neutral-strong text-foreground-neutral'
          : 'bg-background-default hover:bg-background-neutral text-foreground-neutral'
      }`}
    >
      {children}
      <svg
        data-icon
        className={`h-3 w-3 transition-transform ${open ? 'rotate-90' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

/**
 * Sidebar item — a leaf node link.
 */
export function SidebarItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon?: ReactNode;
  external?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { prefetch } = useSidebar();
  const active = pathname === href;
  const ref = useRef<HTMLAnchorElement>(null);

  useAutoScroll(active, ref);

  return (
    <li>
      <Link
        ref={ref}
        href={href}
        data-active={active}
        className={`px-2 h-7 flex flex-row items-center justify-start gap-2 font-medium text-sm rounded-square transition-all duration-50 ${
          active
            ? 'bg-background-neutral hover:bg-background-neutral-strong text-foreground-neutral'
            : 'bg-background-default hover:bg-background-neutral text-foreground-neutral'
        }`}
      >
        {icon}
        {children}
      </Link>
    </li>
  );
}

/**
 * Sidebar separator — a heading or horizontal rule.
 */
export function SidebarSeparator({ children }: { children?: ReactNode }) {
  const depth = useFolderDepth();

  if (!children) return <hr className="mx-2 my-3 border-stroke-neutral" />;

  return (
    <li

      className={`mt-6 mb-2 px-2 font-semibold uppercase tracking-wider text-2xs text-foreground-neutral-weak ${depth === 0 ? 'first:mt-0' : ''}`}
    >
      {children}
    </li>
  );
}

/**
 * Auto-scroll the active sidebar item into view.
 */
export function useAutoScroll(
  active: boolean,
  ref: RefObject<HTMLElement | null>,
) {
  const { mode } = useSidebar();

  useEffect(() => {
    if (active && ref.current) {
      scrollIntoView(ref.current, {
        boundary: document.getElementById('nd-sidebar'),
        scrollMode: 'if-needed',
      });
    }
  }, [active, mode, ref]);
}
