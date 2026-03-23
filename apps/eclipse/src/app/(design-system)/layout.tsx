import { source } from '@/lib/source';
import { Nav } from '@/components/nav';
import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/sidebar-context';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Nav />
      <div data-component="docs-layout">
        <Sidebar tree={source.pageTree} />
        <main>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
