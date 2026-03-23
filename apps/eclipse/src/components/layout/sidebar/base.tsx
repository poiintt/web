'use client';

import {
  type ComponentProps,
  createContext,
  type PointerEvent,
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
import ReactDOM from 'react-dom';

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

// -- Sidebar content (render-function pattern) --

export function SidebarContent({
  children,
}: {
  children: (state: {
    ref: RefObject<HTMLElement | null>;
    collapsed: boolean;
    hovered: boolean;
    onPointerEnter: (event: PointerEvent) => void;
    onPointerLeave: (event: PointerEvent) => void;
  }) => ReactNode;
}) {
  const { collapsed, mode } = useSidebar();
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timerRef = useRef(0);

  useOnChange(collapsed, () => {
    if (collapsed) setHover(false);
  });

  if (mode !== 'full') return;

  function shouldIgnoreHover(e: PointerEvent): boolean {
    const element = ref.current;
    if (!element) return true;

    return (
      !collapsed ||
      e.pointerType === 'touch' ||
      element.getAnimations().length > 0
    );
  }

  return children({
    ref,
    collapsed,
    hovered: hover,
    onPointerEnter(e) {
      if (shouldIgnoreHover(e)) return;
      window.clearTimeout(timerRef.current);
      setHover(true);
    },
    onPointerLeave(e) {
      if (shouldIgnoreHover(e)) return;
      window.clearTimeout(timerRef.current);

      timerRef.current = window.setTimeout(
        () => setHover(false),
        Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100
          ? 0
          : 500,
      );
    },
  });
}

// -- Sidebar drawer (mobile) --

export function SidebarDrawerOverlay(props: ComponentProps<'div'>) {
  const { open, setOpen, mode } = useSidebar();
  const [hidden, setHidden] = useState(!open);

  if (open && hidden) setHidden(false);
  if (mode !== 'drawer' || hidden) return;

  return (
    <div
      data-state={open ? 'open' : 'closed'}
      onClick={() => setOpen(false)}
      onAnimationEnd={() => {
        if (!open) ReactDOM.flushSync(() => setHidden(true));
      }}
      {...props}
    />
  );
}

export function SidebarDrawerContent({
  className,
  children,
  ...props
}: ComponentProps<'aside'>) {
  const { open, mode } = useSidebar();
  const [hidden, setHidden] = useState(!open);

  if (open && hidden) setHidden(false);
  if (mode !== 'drawer') return;

  return (
    <aside
      id="nd-sidebar-mobile"
      data-state={open ? 'open' : 'closed'}
      className={`${hidden ? 'invisible' : ''} ${className ?? ''}`}
      onAnimationEnd={() => {
        if (!open) ReactDOM.flushSync(() => setHidden(true));
      }}
      {...props}
    >
      {children}
    </aside>
  );
}

// -- Sidebar trigger --

export function SidebarTrigger({
  children,
  ...props
}: ComponentProps<'button'>) {
  const { setOpen } = useSidebar();

  return (
    <button
      aria-label="Open Sidebar"
      onClick={() => setOpen((prev) => !prev)}
      {...props}
    >
      {children}
    </button>
  );
}

// -- Folder primitives --

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
  const defaultOpen =
    active || (defaultOpenProp ?? defaultOpenLevel >= depth);
  const [open, setOpen] = useState(defaultOpen);

  useOnChange(defaultOpen, (v) => {
    if (v) setOpen(v);
  });

  return (
    <FolderContext
      value={useMemo(() => ({ open, setOpen, depth }), [depth, open])}
    >
      {children}
    </FolderContext>
  );
}

export function SidebarFolderTrigger({
  children,
}: {
  children: ReactNode;
}) {
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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

export function SidebarFolderContent({
  children,
}: {
  children: ReactNode;
}) {
  const { open } = useFolder()!;
  if (!open) return null;

  return (
    <ul className="my-1 pl-3 flex flex-col items-stretch justify-center gap-1">
      {children}
    </ul>
  );
}

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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}

// -- Item and separator --

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

// -- Auto-scroll utility --

export function useAutoScroll(
  active: boolean,
  ref: RefObject<HTMLElement | null>,
) {
  const { mode } = useSidebar();

  useEffect(() => {
    if (active && ref.current) {
      scrollIntoView(ref.current, {
        boundary: document.getElementById(
          mode === 'drawer' ? 'nd-sidebar-mobile' : 'nd-sidebar',
        ),
        scrollMode: 'if-needed',
      });
    }
  }, [active, mode, ref]);
}
