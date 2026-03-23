'use client';

import { useEffect, useState, type ReactNode } from 'react';

interface TOCItem {
  title: ReactNode;
  url: string;
  depth: number;
}

function useActiveHeading(items: TOCItem[]) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const ids = items.map((item) => item.url.replace('#', ''));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  return activeId;
}

export function TableOfContents({ items }: { items: TOCItem[] }) {
  const activeId = useActiveHeading(items);

  if (items.length === 0) return null;

  return (
    <nav className="my-0.5 sticky top-[6.25rem] flex flex-col items-stretch justify-start gap-6">
      <ul className="flex flex-col items-stretch justify-start gap-1 border-l border-stroke-neutral">
        {items.map((item) => {
          const isActive = activeId === item.url.replace('#', '');
          return (
            <li key={item.url}>
              <a
                href={item.url}
                className={`-ml-[1px] px-2 flex flex-row items-center justify-start text-sm truncate border-l transition-colors duration-50 ${
                  isActive
                    ? 'text-foreground-neutral border-stroke-ppg'
                    : 'text-foreground-neutral-weak hover:text-foreground-neutral border-stroke-neutral'
                }`}
                style={{ paddingLeft: `${(item.depth - 1) * 1}rem` }}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
