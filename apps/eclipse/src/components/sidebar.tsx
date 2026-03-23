'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Root, Node, Separator, Item, Folder } from 'fumadocs-core/page-tree';
import { SearchToggle } from './search';
import { useSidebar } from './sidebar-context';

export function Sidebar({ tree }: { tree: Root }) {
  const { open, close } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop overlay — mobile only */}
      <div
        className={`fixed inset-0 z-40 bg-background-default/50 backdrop-blur-surface transition-opacity md:hidden ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        data-component="sidebar"
        className={`fixed top-2 md:top-[3.75rem] left-2 bottom-2 right-auto z-50 w-[15rem] flex flex-col items-stretch justify-start bg-background-default border border-stroke-neutral rounded-square-high shadow-box overflow-hidden transition-transform duration-150 ${
          open ? 'translate-x-0' : '-translate-x-[calc(100%+0.5rem)] md:translate-x-0'
        }`}
      >
        <div className="grow-0 p-3 flex flex-col items-stretch justify-start gap-3 bg-background-default/50 border-b last:border-b-none border-stroke-neutral backdrop-blur-surface-low">
          <SearchToggle />
        </div>
        <div className="grow-1 p-3 flex flex-col items-stretch justify-start gap-3 bg-background-default border-b last:border-b-none border-stroke-neutral overflow-y-scroll no-scrollbar">
          <SidebarNodes nodes={tree.children} pathname={pathname} />
        </div>
      </aside>
    </>
  );
}

function SidebarNodes({ nodes, pathname }: { nodes: Node[]; pathname: string }) {
  return (
    <ul data-component="sidebar-nodes" className="flex flex-col items-stretch justify-start gap-0.5">
      {nodes.map((node, i) => (
        <SidebarNode key={i} node={node} pathname={pathname} />
      ))}
    </ul>
  );
}

function SidebarNode({ node, pathname }: { node: Node; pathname: string }) {
  if (node.type === 'separator') {
    return <SidebarSeparator node={node} />;
  }

  if (node.type === 'folder') {
    return <SidebarFolder node={node} pathname={pathname} />;
  }

  return <SidebarItem node={node} pathname={pathname} />;
}

function SidebarSeparator({ node }: { node: Separator }) {
  if (!node.name) return <hr className="mx-2 my-3 border-stroke-neutral" />;

  return (
    <li data-component="sidebar-separator" className="mt-6 first:mt-0 mb-2 px-2 font-semibold uppercase tracking-wider text-2xs text-foreground-neutral-weak">
      {node.name}
    </li>
  );
}

function SidebarItem({ node, pathname }: { node: Item; pathname: string }) {
  const active = pathname === node.url;

  return (
    <li data-component="sidebar-item">
      <Link
        href={node.url}
        className={`px-2 h-7 flex flex-row items-center justify-start gap-2 font-medium text-sm rounded-square transition-all duration-50 ${
          active
            ? 'bg-background-neutral hover:bg-background-neutral-strong text-foreground-neutral'
            : 'bg-background-default hover:bg-background-neutral text-foreground-neutral'
        }`}
      >
        {node.name}
      </Link>
    </li>
  );
}

function SidebarFolder({ node, pathname }: { node: Folder; pathname: string }) {
  const isActive = hasActiveChild(node, pathname);
  const [open, setOpen] = useState(node.defaultOpen ?? isActive);

  return (
    <li data-component="sidebar-folder">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-2 h-7 flex flex-row items-center justify-between gap-2 font-medium text-sm rounded-square transition-all duration-50 ${
          open
            ? 'bg-background-neutral hover:bg-background-neutral-strong text-foreground-neutral'
            : 'bg-background-default hover:bg-background-neutral text-foreground-neutral'
        }`}
      >
        { node.name }
        <svg className={`h-3 w-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && (
        <ul className="my-1 pl-3 flex flex-col items-stretch justify-center gap-1">
          {node.index && <SidebarItem node={node.index} pathname={pathname} />}
          {node.children.map((child, i) => (
            <SidebarNode key={i} node={child} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  );
}

function hasActiveChild(node: Folder, pathname: string): boolean {
  if (node.index?.url === pathname) return true;
  return node.children.some((child) => {
    if (child.type === 'page') return child.url === pathname;
    if (child.type === 'folder') return hasActiveChild(child, pathname);
    return false;
  });
}
