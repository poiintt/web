import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { TreeContextProvider } from '@fumadocs/base-ui/contexts/tree';
import { SidebarProvider, SidebarContent } from '../sidebar/base';
import { SidebarPageTree } from '../sidebar/page-tree';
import { Nav } from '../nav';
import { SearchToggle } from '../search';
import {
  LayoutContextProvider,
  SidebarEnabledFromPageProvider,
} from './context';

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
              {sidebarEnabled && (
                <SidebarContent
                  banner={<SearchToggle />}
                  footer={sidebarProps.footer}
                >
                  <SidebarPageTree />
                </SidebarContent>
              )}
              <main>{children}</main>
            </div>
          </SidebarEnabledFromPageProvider>
        </SidebarProvider>
      </LayoutContextProvider>
    </TreeContextProvider>
  );
}
