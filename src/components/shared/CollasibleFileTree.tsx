import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type TData = {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
};

type NestedTreeItem = TData & {
  children?: NestedTreeItem[];
};

export function CollapsibleFileTree({ data }: { data: TData[] }) {
  const buildTree = (data: TData[]): NestedTreeItem[] => {
    const itemMap: { [key: string]: NestedTreeItem } = {};
    const rootItems: NestedTreeItem[] = [];

    data.forEach((item) => {
      itemMap[item.id] = { ...item, children: [] };
    });

    data.forEach((item) => {
      const mappedItem = itemMap[item.id];
      if (item.parentId === null) {
        rootItems.push(mappedItem);
      } else {
        const parent = itemMap[item.parentId];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(mappedItem);
        }
      }
    });

    return rootItems;
  };

  const nestedTree = buildTree(data);

  const renderItem = (fileItem: NestedTreeItem) => {
    if (fileItem.type === "folder") {
      return (
        <Collapsible key={fileItem.id}>
          <CollapsibleTrigger>
            <Button
              variant='ghost'
              size='sm'
              className='group w-full justify-start gap-2 transition-none hover:bg-accent hover:text-accent-foreground'
            >
              <ChevronRightIcon className='h-4 w-4 transition-transform group-data-[state=open]:rotate-90' />
              <FolderIcon className='h-4 w-4 text-sky-500 fill-sky-500/10' />
              {fileItem.name}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='mt-1 ml-5 flex flex-col gap-1 border-l pl-2 border-muted'>
              {fileItem.children?.map((child) => renderItem(child))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    if (fileItem.type === "file") {
      return (
        <Button
          key={fileItem.id}
          variant='ghost'
          size='sm'
          className='w-full justify-start gap-2 text-foreground pl-8'
        >
          <FileIcon className='h-4 w-4 text-muted-foreground' />
          <span className='normal-case'>{fileItem.name}</span>
        </Button>
      );
    }

    return (
      <Button
        key={fileItem.id}
        variant='ghost'
        size='sm'
        className='w-full justify-start gap-2 text-foreground pl-8'
      >
        <FileIcon className='h-4 w-4 text-muted-foreground' />
        <span>{fileItem.name}</span>
      </Button>
    );
  };

  return (
    <div className='w-full p-4'>
      <div className='flex flex-col gap-1'>{nestedTree.map((item) => renderItem(item))}</div>
    </div>
  );
}
