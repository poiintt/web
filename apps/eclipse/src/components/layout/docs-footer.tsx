'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { useFooterItems } from '@fumadocs/base-ui/utils/use-footer-items';

export function DocsFooter({ className }: { className?: string }) {
  const footerList = useFooterItems();
  const pathname = usePathname();

  const { previous, next } = useMemo(() => {
    const idx = footerList.findIndex((item) => item.url === pathname);
    if (idx === -1) return {};
    return {
      previous: footerList[idx - 1],
      next: footerList[idx + 1],
    };
  }, [footerList, pathname]);

  if (!previous && !next) return null;

  return (
    <nav
      className={`mt-12 grid gap-3 ${previous && next ? 'grid-cols-2' : 'grid-cols-1'} ${className ?? ''}`}
    >
      {previous && (
        <Link
          href={previous.url}
          className="flex flex-col gap-1 p-4 rounded-square border border-stroke-neutral hover:bg-background-neutral transition-colors"
        >
          <span className="text-xs text-foreground-neutral-weak">
            Previous
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground-neutral">
            <svg
              className="size-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {previous.name}
          </span>
        </Link>
      )}
      {next && (
        <Link
          href={next.url}
          className={`flex flex-col gap-1 p-4 rounded-square border border-stroke-neutral hover:bg-background-neutral transition-colors text-end ${!previous ? 'col-start-1' : ''}`}
        >
          <span className="text-xs text-foreground-neutral-weak">Next</span>
          <span className="flex items-center justify-end gap-1.5 text-sm font-medium text-foreground-neutral">
            {next.name}
            <svg
              className="size-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </Link>
      )}
    </nav>
  );
}
