'use client';

import { useDocsSearch } from 'fumadocs-core/search/client';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useCallback, useState } from 'react';

export function SearchToggle() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-row items-center justify-between gap-2 h-8 px-3 bg-background-default border border-stroke-neutral text-sm text-foreground-neutral-weak hover:text-foreground-neutral rounded-square shadow-box-low transition-colors cursor-pointer"
      >
        <span className="text-sm text-foreground-neutral-weak">Search...</span>
        <kbd className="-mr-1.5 px-1.5 py-0.5 bg-background-neutral font-mono text-xs text-foreground-neutral-weaker rounded-square-low">CMD+K</kbd>
      </button>

      {open && createPortal(
        <SearchDialog onClose={() => setOpen(false)} />,
        document.body,
      )}
    </>
  );
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { search, setSearch, query } = useDocsSearch({ type: 'static' });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const onSelect = useCallback(
    (url: string) => {
      router.push(url);
      onClose();
    },
    [router, onClose],
  );

  const results = query.data && query.data !== 'empty' ? query.data : [];

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-background-default/50 backdrop-blur-surface" aria-hidden="true" />

      <div
        data-component="search-dialog"
        className="relative z-10 w-full max-w-lg bg-background-default border border-stroke-neutral rounded-square shadow-box overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
      >
        {/* Search input */}
        <div className="px-4 h-12 flex flex-row items-center gap-2 border-b last:border-b-none border-stroke-neutral">
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documentation..."
            className="flex-1 h-10 bg-transparent text-base text-foreground-neutral placeholder:text-foreground-neutral-weaker outline-none"
          />
          <kbd
            className="px-2 h-6 flex flex-row items-center bg-background-neutral font-mono text-xs text-foreground-neutral-weaker rounded-square-low"
            onClick={onClose}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.isLoading && (
            <p className="p-4 text-sm text-foreground-neutral-weak text-center">Searching...</p>
          )}

          {!query.isLoading && search.length > 0 && results.length === 0 && (
            <p className="p-4 text-sm text-foreground-neutral-weak text-center">No results found.</p>
          )}

          {!query.isLoading && results.length > 0 && (
            <ul className="p-4 flex flex-col items-stretch justify-start gap-2">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => onSelect(result.url)}
                    className="w-full px-2 py-1 flex flex-col items-start gap-1 text-left bg-background-default hover:bg-background-neutral rounded-square-low transition-colors duration-50 cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <ResultIcon type={result.type} />
                      <span className="text-sm font-medium text-foreground-neutral line-clamp-1">{result.content}</span>
                    </span>
                    <span className="ml-7 text-xs text-foreground-neutral-weak truncate max-w-full">
                      { result.url.replace(/^\//, '').replace(/\//g, ' / ') || 'Home' }
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultIcon({ type }: { type: 'page' | 'heading' | 'text' }) {
  if (type === 'page') {
    return (
      <svg className="size-4 text-foreground-neutral-weak shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    );
  }

  if (type === 'heading') {
    return (
      <svg className="size-4 text-foreground-neutral-weak shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
      </svg>
    );
  }

  return (
    <svg className="size-4 text-foreground-neutral-weak shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  );
}
