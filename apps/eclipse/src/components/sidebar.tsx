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
import { useTreeContext, useTreePath } from '@fumadocs/base-ui/contexts/tree';
import scrollIntoView from 'scroll-into-view-if-needed';
import ReactDOM from 'react-dom';
import type * as PageTree from 'fumadocs-core/page-tree';

// -- Types --

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

// -- Contexts --

const SidebarContext = createContext<SidebarContextValue | null>(null);

const FolderContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  depth: number;
} | null>(null);

// -- Hooks --

export function useSidebar(): SidebarContextValue {
  const ctx = use(SidebarContext);
  if (!ctx) throw new Error('Missing SidebarContext, wrap in <DocsLayout />.');
  return ctx;
}

function useFolder() {
  return use(FolderContext);
}

function useFolderDepth() {
  return use(FolderContext)?.depth ?? 0;
}

function useAutoScroll(
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

// -- Provider --

export function SidebarProvider({
  defaultOpenLevel = 0,
  prefetch,
  children,
}: {
  defaultOpenLevel?: number;
  prefetch?: boolean;
  children?: ReactNode;
}) {
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

// -- Desktop sidebar --

export function SidebarContent({
  banner,
  footer,
  children,
}: {
  banner?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { collapsed, mode } = useSidebar();
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const timerRef = useRef(0);

  useOnChange(collapsed, () => {
    if (collapsed) setHover(false);
  });

  if (mode !== 'full') return null;

  function shouldIgnoreHover(e: PointerEvent): boolean {
    const element = ref.current;
    if (!element) return true;
    return (
      !collapsed ||
      e.pointerType === 'touch' ||
      element.getAnimations().length > 0
    );
  }

  return (
    <aside
      id="nd-sidebar"
      ref={ref}
      data-collapsed={collapsed}
      data-hovered={collapsed && hover}
      className="fixed top-2 md:top-[3.75rem] left-2 bottom-2 right-auto z-50 w-[15rem] flex flex-col items-stretch justify-start bg-background-default border border-stroke-neutral rounded-square-high shadow-box overflow-hidden max-md:hidden"
      onPointerEnter={(e) => {
        if (shouldIgnoreHover(e)) return;
        window.clearTimeout(timerRef.current);
        setHover(true);
      }}
      onPointerLeave={(e) => {
        if (shouldIgnoreHover(e)) return;
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(
          () => setHover(false),
          Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100
            ? 0
            : 500,
        );
      }}
    >
      <SidebarInner banner={banner} footer={footer}>
        {children}
      </SidebarInner>
    </aside>
  );
}

// -- Mobile drawer --

export function SidebarDrawer({
  banner,
  footer,
  children,
}: {
  banner?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { open, setOpen, mode } = useSidebar();
  const [overlayHidden, setOverlayHidden] = useState(!open);
  const [drawerHidden, setDrawerHidden] = useState(!open);

  if (open && overlayHidden) setOverlayHidden(false);
  if (open && drawerHidden) setDrawerHidden(false);

  if (mode !== 'drawer') return null;

  return (
    <>
      {!overlayHidden && (
        <div
          data-state={open ? 'open' : 'closed'}
          className="fixed inset-0 z-40 bg-background-default/50 backdrop-blur-surface data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
          onClick={() => setOpen(false)}
          onAnimationEnd={() => {
            if (!open) ReactDOM.flushSync(() => setOverlayHidden(true));
          }}
        />
      )}
      <aside
        id="nd-sidebar-mobile"
        data-state={open ? 'open' : 'closed'}
        className={`fixed top-2 left-2 bottom-2 right-auto z-50 w-[15rem] flex flex-col items-stretch justify-start bg-background-default border border-stroke-neutral rounded-square-high shadow-box overflow-hidden data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out ${drawerHidden ? 'invisible' : ''}`}
        onAnimationEnd={() => {
          if (!open) ReactDOM.flushSync(() => setDrawerHidden(true));
        }}
      >
        <SidebarInner banner={banner} footer={footer}>
          {children}
        </SidebarInner>
      </aside>
    </>
  );
}

function SidebarInner({
  banner,
  footer,
  children,
}: {
  banner?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
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
    </>
  );
}

// -- Folder primitives --

function SidebarFolder({
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
      {children}
    </FolderContext>
  );
}

function SidebarFolderTrigger({ children }: { children: ReactNode }) {
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

function SidebarFolderContent({ children }: { children: ReactNode }) {
  const { open } = useFolder()!;
  if (!open) return null;

  return (
    <ul className="my-1 pl-3 flex flex-col items-stretch justify-center gap-1">
      {children}
    </ul>
  );
}

function SidebarFolderLink({ href, children }: { href: string; children: ReactNode }) {
  const { open, setOpen } = useFolder()!;
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

function SidebarItem({ href, icon, children }: { href: string; icon?: ReactNode; external?: boolean; children: ReactNode }) {
  const pathname = usePathname();
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

function SidebarSeparator({ children }: { children?: ReactNode }) {
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

// -- Page tree --

function PageTreeFolder({ item, children }: { item: PageTree.Folder; children: ReactNode }) {
  const path = useTreePath();

  return (
    <SidebarFolder active={path.includes(item)} defaultOpen={item.defaultOpen}>
      {item.index ? (
        <SidebarFolderLink href={item.index.url}>
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger>
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

export function SidebarPageTree() {
  const { root } = useTreeContext();

  return useMemo(() => {
    function renderNodes(items: PageTree.Node[]) {
      return items.map((item, i) => {
        if (item.type === 'separator') {
          return (
            <SidebarSeparator key={i}>
              {item.name ? (
                <>
                  {item.icon}
                  {item.name}
                </>
              ) : null}
            </SidebarSeparator>
          );
        }

        if (item.type === 'folder') {
          return (
            <PageTreeFolder key={i} item={item}>
              {renderNodes(item.children)}
            </PageTreeFolder>
          );
        }

        return (
          <SidebarItem
            key={item.url}
            href={item.url}
            icon={item.icon}
            external={item.external}
          >
            {item.name}
          </SidebarItem>
        );
      });
    }

    return (
      <ul
        key={root.$id}
        className="flex flex-col items-stretch justify-start gap-0.5"
      >
        {renderNodes(root.children)}
      </ul>
    );
  }, [root]);
}
