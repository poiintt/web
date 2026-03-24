import { source } from '@/lib/source';
import { DocsLayout } from '@/components/layout';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={source.pageTree}>
      {children}
    </DocsLayout>
  );
}
