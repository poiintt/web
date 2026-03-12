'use client';

import { Tabs as Primitive } from '@base-ui/react/tabs';
import * as React from 'react';
import {
  type ComponentProps,
  createContext,
  use,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeRefs } from '../../lib/merge-refs';

type ChangeListener = (v: string) => void;
const listeners = new Map<string, Set<ChangeListener>>();

type PrimitiveTabsRootProps = Omit<
  ComponentProps<typeof Primitive.Root>,
  'className' | 'value' | 'defaultValue' | 'onValueChange'
>;

export interface TabsProps extends PrimitiveTabsRootProps {
  className?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Identifier for Sharing value of tabs
   */
  groupId?: string;

  /**
   * Enable persistent
   */
  persist?: boolean;

  /**
   * If true, updates the URL hash based on the tab's id
   */
  updateAnchor?: boolean;
}

const TabsContext = createContext<{
  valueToIdMap: Map<string, string>;
} | null>(null);

function useTabContext() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error('You must wrap your component in <Tabs>');
  return ctx;
}

type PrimitiveTabsListProps = Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.List>,
  'className'
> & {
  className?: string;
};

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof Primitive.List>,
  PrimitiveTabsListProps
>(({ className, ...props }, ref) => (
  <Primitive.List ref={ref} className={className} {...props} />
));
TabsList.displayName = Primitive.List.displayName;

type PrimitiveTabsTriggerProps = Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.Tab>,
  'className' | 'value'
> & {
  className?: string;
  value: string;
};

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof Primitive.Tab>,
  PrimitiveTabsTriggerProps
>(({ className, ...props }, ref) => (
  <Primitive.Tab
    ref={ref}
    className={className}
    {...props}
    render={(renderProps, state) => (
      <button
        {...renderProps}
        data-state={state.active ? "active" : "inactive"}
      />
    )}
  />
));
TabsTrigger.displayName = Primitive.Tab.displayName;

export function Tabs({
  ref,
  groupId,
  persist = false,
  updateAnchor = false,
  defaultValue,
  value: _value,
  onValueChange: _onValueChange,
  ...props
}: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const valueToIdMap = useMemo(() => new Map<string, string>(), []);
  const isControlled = _value !== undefined;
  const initialDefaultValueRef = useRef(defaultValue);
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(
    initialDefaultValueRef.current,
  );
  const value = isControlled ? _value : uncontrolledValue;
  const setValue = (nextValue: string) => {
    if (isControlled) {
      _onValueChange?.(nextValue);
      return;
    }
    setUncontrolledValue(nextValue);
  };

  useLayoutEffect(() => {
    if (!groupId) return;
    let previous = sessionStorage.getItem(groupId);
    if (persist) previous ??= localStorage.getItem(groupId);
    if (previous) setValue(previous);

    const groupListeners = listeners.get(groupId) ?? new Set();
    groupListeners.add(setValue);
    listeners.set(groupId, groupListeners);
    return () => {
      groupListeners.delete(setValue);
    };
  }, [groupId, isControlled, persist, setValue]);

  useLayoutEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    for (const [value, id] of valueToIdMap.entries()) {
      if (id === hash) {
        setValue(value);
        tabsRef.current?.scrollIntoView();
        break;
      }
    }
  }, [setValue, valueToIdMap]);

  return (
    <Primitive.Root
      ref={mergeRefs(ref, tabsRef)}
      value={value}
      onValueChange={(v) => {
        const valueKey = String(v);

        if (updateAnchor) {
          const id = valueToIdMap.get(valueKey);

          if (id) {
            window.history.replaceState(null, '', `#${id}`);
          }
        }

        if (groupId) {
          const groupListeners = listeners.get(groupId);
          if (groupListeners) {
            for (const listener of groupListeners) listener(valueKey);
          }

          sessionStorage.setItem(groupId, valueKey);
          if (persist) localStorage.setItem(groupId, valueKey);
        } else {
          setValue(valueKey);
        }
      }}
      {...props}
    >
      <TabsContext value={useMemo(() => ({ valueToIdMap }), [valueToIdMap])}>
        {props.children}
      </TabsContext>
    </Primitive.Root>
  );
}

type PrimitiveTabsContentProps = Omit<
  ComponentProps<typeof Primitive.Panel>,
  'className' | 'keepMounted' | 'value'
>;

export interface TabsContentProps extends PrimitiveTabsContentProps {
  className?: string;
  value: string;
  forceMount?: boolean;
}

export function TabsContent({ value, forceMount, ...props }: TabsContentProps) {
  const { valueToIdMap } = useTabContext();

  if (props.id) {
    valueToIdMap.set(String(value), props.id);
  }

  return (
    <Primitive.Panel
      value={value}
      keepMounted={forceMount}
      {...props}
      render={(renderProps, state) => (
        <div
          {...renderProps}
          data-state={state.hidden ? "inactive" : "active"}
        />
      )}
    >
      {props.children}
    </Primitive.Panel>
  );
}
