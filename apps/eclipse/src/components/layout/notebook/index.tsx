import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { TreeContextProvider } from '@fumadocs/base-ui/contexts/tree';
import { SidebarProvider } from '../sidebar/base';
import {
  SidebarContent,
  SidebarDrawer,
  SidebarPageTree,
} from './sidebar';
import { SearchToggle } from '../../search';
import {
  LayoutContextProvider,
  SidebarEnabledFromPageProvider,
  Nav,
} from './client';

export interface DocsLayoutProps {
  tree: PageTree.Root;

  sidebar?: {
    banner?: ReactNode;
    footer?: ReactNode;
    enabled?: boolean;
    defaultOpenLevel?: number;
    prefetch?: boolean;
  };

  children: ReactNode;
}

export function DocsLayout({
  tree,
  sidebar: {
    enabled: sidebarEnabled = true,
    defaultOpenLevel,
    prefetch,
    ...sidebarProps
  } = {},
  children,
}: DocsLayoutProps) {
  const searchBanner = <SearchToggle />;

  function sidebar() {
    return (
      <>
        <SidebarContent banner={searchBanner} footer={sidebarProps.footer}>
          <SidebarPageTree />
        </SidebarContent>
        <SidebarDrawer banner={searchBanner} footer={sidebarProps.footer}>
          <SidebarPageTree />
        </SidebarDrawer>
      </>
    );
  }

  return (
    <TreeContextProvider tree={tree}>
      <LayoutContextProvider>
        <SidebarProvider
          defaultOpenLevel={defaultOpenLevel}
          prefetch={prefetch}
        >
          <SidebarEnabledFromPageProvider layoutEnabled={sidebarEnabled}>
            <Nav />
            <div>
              {sidebarEnabled && sidebar()}
              <main>{children}</main>
            </div>
          </SidebarEnabledFromPageProvider>
        </SidebarProvider>
      </LayoutContextProvider>
    </TreeContextProvider>
  );
}
