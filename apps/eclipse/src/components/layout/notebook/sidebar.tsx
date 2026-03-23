'use client';

import type { ReactNode } from 'react';
import * as Base from '../sidebar/base';

export {
  SidebarProvider,
  SidebarFolder,
  SidebarFolderTrigger,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarItem,
  SidebarSeparator,
  SidebarTrigger,
} from '../sidebar/base';

export { SidebarPageTree } from '../sidebar/page-tree';

export function SidebarContent({
  banner,
  footer,
  children,
}: {
  banner?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Base.SidebarContent>
      {({ ref, collapsed, hovered, ...rest }) => (
        <aside
          id="nd-sidebar"
          ref={ref}
          data-collapsed={collapsed}
          data-hovered={collapsed && hovered}
          className="fixed top-2 md:top-[3.75rem] left-2 bottom-2 right-auto z-50 w-[15rem] flex flex-col items-stretch justify-start bg-background-default border border-stroke-neutral rounded-square-high shadow-box overflow-hidden max-md:hidden"
          {...rest}
        >
          <SidebarInner banner={banner} footer={footer}>
            {children}
          </SidebarInner>
        </aside>
      )}
    </Base.SidebarContent>
  );
}

export function SidebarDrawer({
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
      <Base.SidebarDrawerOverlay className="fixed inset-0 z-40 bg-background-default/50 backdrop-blur-surface data-[state=open]:animate-ec-fade-in data-[state=closed]:animate-ec-fade-out" />
      <Base.SidebarDrawerContent className="fixed top-2 left-2 bottom-2 right-auto z-50 w-[15rem] flex flex-col items-stretch justify-start bg-background-default border border-stroke-neutral rounded-square-high shadow-box overflow-hidden data-[state=open]:animate-ec-sidebar-in data-[state=closed]:animate-ec-sidebar-out">
        <SidebarInner banner={banner} footer={footer}>
          {children}
        </SidebarInner>
      </Base.SidebarDrawerContent>
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
