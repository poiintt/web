'use client';

import {
  type ComponentProps,
  createContext,
  type RefObject,
  use,
  useEffect,
  useEffectEvent,
  useRef,
} from 'react';
import * as Primitive from 'fumadocs-core/toc';
import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import { mergeRefs } from '../../lib/merge-refs';

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

// -- TocThumb (animated active indicator) --

type TocThumbType = [top: number, height: number];

interface TocThumbProps extends ComponentProps<'div'> {
  containerRef: RefObject<HTMLElement | null>;
}

export function TocThumb({ containerRef, ...props }: TocThumbProps) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const active = Primitive.useActiveAnchors();

  function update(info: TocThumbType): void {
    const element = thumbRef.current;
    if (!element) return;
    element.style.setProperty('--ec-top', `${info[0]}px`);
    element.style.setProperty('--ec-height', `${info[1]}px`);
  }

  const onPrint = useEffectEvent(() => {
    if (containerRef.current) {
      update(calc(containerRef.current, active));
    }
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const observer = new ResizeObserver(onPrint);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  useOnChange(active, () => {
    if (containerRef.current) {
      update(calc(containerRef.current, active));
    }
  });

  return <div ref={thumbRef} data-hidden={active.length === 0} {...props} />;
}

function calc(container: HTMLElement, active: string[]): TocThumbType {
  if (active.length === 0 || container.clientHeight === 0) {
    return [0, 0];
  }

  let upper = Number.MAX_VALUE,
    lower = 0;

  for (const item of active) {
    const element = container.querySelector<HTMLElement>(`a[href="#${item}"]`);
    if (!element) continue;

    const styles = getComputedStyle(element);
    upper = Math.min(upper, element.offsetTop + parseFloat(styles.paddingTop));
    lower = Math.max(
      lower,
      element.offsetTop + element.clientHeight - parseFloat(styles.paddingBottom),
    );
  }

  return [upper, lower - upper];
}

// -- TOC items rendered with Eclipse design --

export function TOCItems({ ref, ...props }: ComponentProps<'div'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const items = useTOCItems();

  if (items.length === 0) return null;

  return (
    <>
      <TocThumb
        containerRef={containerRef}
        className="absolute top-[var(--ec-top)] h-[var(--ec-height)] w-[1px] bg-stroke-ppg transition-[top,height] ease-linear data-[hidden=true]:opacity-0"
      />
      <div
        ref={mergeRefs(ref, containerRef)}
        className="flex flex-col border-l border-stroke-neutral"
        {...props}
      >
        {items.map((item) => (
          <TOCItem key={item.url} item={item} />
        ))}
      </div>
    </>
  );
}

function TOCItem({ item }: { item: Primitive.TOCItemType }) {
  return (
    <Primitive.TOCItem
      href={item.url}
      className="px-2 py-1 flex flex-row items-center justify-start text-sm truncate border-l border-transparent transition-colors duration-50 text-foreground-neutral-weak hover:text-foreground-neutral data-[active=true]:text-foreground-neutral"
      style={{ paddingLeft: `${(item.depth - 1) * 1}rem` }}
    >
      {item.title}
    </Primitive.TOCItem>
  );
}

/**
 * TableOfContents — reads items from TOCProvider context.
 */
export function TableOfContents() {
  const items = useTOCItems();
  if (items.length === 0) return null;

  return (
    <nav className="relative my-0.5 sticky top-[6.25rem] flex flex-col items-stretch justify-start gap-6">
      <TOCItems />
    </nav>
  );
}
