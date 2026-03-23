'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import EclipseSearchDialog from '@/components/search';
import type { ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{
        SearchDialog: EclipseSearchDialog,
      }}
      theme={{ enabled: false }}
    >
      {children}
    </RootProvider>
  );
}
