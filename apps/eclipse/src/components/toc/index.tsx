'use client';

import {
  type ComponentProps,
  createContext,
  use,
  type ReactNode,
} from 'react';
import * as Primitive from 'fumadocs-core/toc';

// -- Context for sharing TOC items --

const TOCContext = createContext<Primitive.TOCItemType[]>([]);

export function useTOCItems(): Primitive.TOCItemType[] {
  return use(TOCContext);
}

/**
 * Wraps children with fumadocs-core AnchorProvider for heading tracking.
 * Matches docs' TOCProvider pattern.
 */
export function TOCProvider({
  toc,
  children,
  ...props
}: ComponentProps<typeof Primitive.AnchorProvider>) {
  return (
    <TOCContext value={toc}>
      <Primitive.AnchorProvider toc={toc} {...props}>
        {children}
      </Primitive.AnchorProvider>
    </TOCContext>
  );
}

// -- TOC items rendered with Eclipse design --

export function TOCItems() {
  const items = useTOCItems();

  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col items-stretch justify-start border-l border-stroke-neutral">
      {items.map((item) => (
        <TOCItem key={item.url} item={item} />
      ))}
    </ul>
  );
}

function TOCItem({ item }: { item: Primitive.TOCItemType }) {
  return (
    <li>
      <Primitive.TOCItem
        href={item.url}
        className="-ml-[1px] px-2 py-1 flex flex-row items-center justify-start text-sm truncate border-l transition-colors duration-50 text-foreground-neutral-weak hover:text-foreground-neutral border-stroke-neutral data-[active=true]:text-foreground-neutral data-[active=true]:border-stroke-ppg"
        style={{ paddingLeft: `${(item.depth - 1) * 1}rem` }}
      >
        {item.title}
      </Primitive.TOCItem>
    </li>
  );
}

/**
 * TableOfContents — reads items from TOCProvider context.
 */
export function TableOfContents() {
  const items = useTOCItems();
  if (items.length === 0) return null;

  return (
    <nav className="my-0.5 sticky top-[6.25rem] flex flex-col items-stretch justify-start gap-6">
      <TOCItems />
    </nav>
  );
}
