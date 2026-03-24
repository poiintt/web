import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { TreeContextProvider } from '@fumadocs/base-ui/contexts/tree';
import { SidebarProvider, SidebarContent, SidebarDrawer, SidebarPageTree } from './sidebar';
import { Nav } from './nav';
import { SearchToggle } from './search';
import { SidebarEnabledFromPageProvider } from './page';

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

  return (
    <TreeContextProvider tree={tree}>
      <SidebarProvider
        defaultOpenLevel={defaultOpenLevel}
        prefetch={prefetch}
      >
        <SidebarEnabledFromPageProvider layoutEnabled={sidebarEnabled}>
          <Nav />
          <div>
            {sidebarEnabled && (
              <>
                <SidebarContent banner={searchBanner} footer={sidebarProps.footer}>
                  <SidebarPageTree />
                </SidebarContent>
                <SidebarDrawer banner={searchBanner} footer={sidebarProps.footer}>
                  <SidebarPageTree />
                </SidebarDrawer>
              </>
            )}
            <main>{children}</main>
          </div>
        </SidebarEnabledFromPageProvider>
      </SidebarProvider>
    </TreeContextProvider>
  );
}
