'use client';

import { useTreeContext, useTreePath } from '@fumadocs/base-ui/contexts/tree';
import { type ReactNode, useMemo, Fragment } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
} from './base';

function PageTreeFolder({
  item,
  children,
}: {
  item: PageTree.Folder;
  children: ReactNode;
}) {
  const path = useTreePath();

  return (
    <SidebarFolder active={path.includes(item)} defaultOpen={item.defaultOpen}>
      {item.index ? (
        <SidebarFolderLink href={item.index.url}>
          {item.icon}
          {item.name}
        </SidebarFolderLink>
      ) : (
        <SidebarFolderTrigger>
          {item.icon}
          {item.name}
        </SidebarFolderTrigger>
      )}
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

export function SidebarPageTree() {
  const { root } = useTreeContext();

  return useMemo(() => {
    function renderNodes(items: PageTree.Node[]) {
      return items.map((item, i) => {
        if (item.type === 'separator') {
          return (
            <SidebarSeparator key={i}>
              {item.name ? (
                <>
                  {item.icon}
                  {item.name}
                </>
              ) : null}
            </SidebarSeparator>
          );
        }

        if (item.type === 'folder') {
          return (
            <PageTreeFolder key={i} item={item}>
              {renderNodes(item.children)}
            </PageTreeFolder>
          );
        }

        return (
          <SidebarItem
            key={item.url}
            href={item.url}
            icon={item.icon}
            external={item.external}
          >
            {item.name}
          </SidebarItem>
        );
      });
    }

    return (
      <ul
        key={root.$id}

        className="flex flex-col items-stretch justify-start gap-0.5"
      >
        {renderNodes(root.children)}
      </ul>
    );
  }, [root]);
}
