'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useSearchContext } from '@fumadocs/base-ui/contexts/search';

export default function EclipseSearchDialog(props: SharedProps) {
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogInput />
          <SearchDialogClose aria-label="Close search">
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </SearchDialogClose>
        </SearchDialogHeader>
        <SearchDialogList
          items={query.data !== 'empty' ? query.data : null}
        />
      </SearchDialogContent>
    </SearchDialog>
  );
}

export function SearchToggle() {
  const { setOpenSearch } = useSearchContext();

  return (
    <button
      onClick={() => setOpenSearch(true)}
      className="flex flex-row items-center justify-between gap-2 h-8 px-3 bg-background-default border border-stroke-neutral text-sm text-foreground-neutral-weak hover:text-foreground-neutral rounded-square shadow-box-low transition-colors cursor-pointer"
    >
      <span className="text-sm text-foreground-neutral-weak">Search...</span>
      <kbd className="-mr-1.5 px-1.5 py-0.5 bg-background-neutral font-mono text-xs text-foreground-neutral-weaker rounded-square-low">
        CMD+K
      </kbd>
    </button>
  );
}
