"use client";

import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";


import {ChevronRight, Folder, File, type LucideIcon} from "lucide-react";
import useResizeObserver from "use-resize-observer";
import {cn} from "@/lib/utils";
import {ScrollArea} from "@/components/tailwind/ui/scroll-area";


interface FileSystemItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: FileSystemItem[];
    icon?: LucideIcon;
}

type FileSystemTreeProps = React.HTMLAttributes<HTMLDivElement> & {
    data: FileSystemItem[] | FileSystemItem;
    initialSelectedItemId?: string;
    onSelectChange?: (item: FileSystemItem | undefined) => void;
    expandAll?: boolean;
    onCreateFile?: (parentId: string) => void;
    onCreateFolder?: (parentId: string) => void;
    onDelete?: (item: FileSystemItem) => void;
    folderIcon?: LucideIcon,
    itemIcon?: LucideIcon
}

const FileSystemTree = React.forwardRef<HTMLDivElement, FileSystemTreeProps>(({
                                                                                  data,
                                                                                  initialSelectedItemId,
                                                                                  onSelectChange,
                                                                                  expandAll,
                                                                                  onCreateFile,
                                                                                  onCreateFolder,
                                                                                  onDelete,
                                                                                  folderIcon: FolderIcon = Folder,
                                                                                  itemIcon: FileIcon = File,
                                                                                  className,
                                                                                  ...props
                                                                              }, ref) => {
    const [selectedItemId, setSelectedItemId] = React.useState<string | undefined>(initialSelectedItemId);
    
    const handleSelectChange = React.useCallback((item: FileSystemItem | undefined) => {
        setSelectedItemId(item?.id);
        if (onSelectChange) {
            onSelectChange(item);
        }
    }, [onSelectChange]);
    
    const expandedItemIds = React.useMemo(() => {
        if (!initialSelectedItemId) {
            return [] as string[]
        }
        
        const ids: string[] = []
        
        function walkTreeItems(items: FileSystemItem[] | FileSystemItem, targetId: string) {
            if (items instanceof Array) {
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < items.length; i++) {
                    ids.push(items[i]!.id);
                    if (walkTreeItems(items[i]!, targetId) && !expandAll) {
                        return true;
                    }
                    if (!expandAll) ids.pop();
                }
            } else if (!expandAll && items.id === targetId) {
                return true;
            } else if (items.children) {
                return walkTreeItems(items.children, targetId)
            }
        }
        
        walkTreeItems(data, initialSelectedItemId)
        return ids;
    }, [data, initialSelectedItemId])
    
    const {ref: refRoot, width, height} = useResizeObserver();
    
    return (
      <div ref={refRoot} className={cn("overflow-hidden", className)}>
          <ScrollArea style={{ width, height }}>
              <div className="relative p-2">
                  <FileSystemItem
                    data={data}
                    ref={ref}
                    selectedItemId={selectedItemId}
                    handleSelectChange={handleSelectChange}
                    expandedItemIds={expandedItemIds}
                    onCreateFile={onCreateFile}
                    onCreateFolder={onCreateFolder}
                    onDelete={onDelete}
                    FolderIcon={FolderIcon}
                    ItemIcon={FileIcon}
                    {...props}
                  />
              </div>
          </ScrollArea>
      </div>
    );
});

type TreeItemProps =
  FileSystemTreeProps &
  {
      selectedItemId?: string,
      handleSelectChange: (item: FileSystemItem | undefined) => void,
      expandedItemIds: string[],
      FolderIcon?: LucideIcon,
      ItemIcon?: LucideIcon
  }

const FileSystemItem = React.forwardRef<
  HTMLDivElement,
  TreeItemProps
>(({className, data, selectedItemId, handleSelectChange, expandedItemIds, FolderIcon, ItemIcon, ...props}, ref) => {
    return (
      <div ref={ref} role="tree" className={className} {...props}>
          <ul>
              {data instanceof Array ? (
                data.map((item) => (
                  <li key={item.id}>
                      {item.children ? (
                        <AccordionPrimitive.Root type="multiple" defaultValue={expandedItemIds}>
                            <AccordionPrimitive.Item value={item.id}>
                                <AccordionTrigger
                                  className={cn(
                                    "px-2 hover:before:opacity-100 before:absolute before:left-0 before:w-full before:opacity-0 before:bg-muted/80 before:h-[1.75rem] before:-z-10",
                                    selectedItemId === item.id && "before:opacity-100 before:bg-accent text-accent-foreground before:border-l-2 before:border-l-accent-foreground/50 dark:before:border-0"
                                  )}
                                  onClick={() => handleSelectChange(item)}
                                >
                                    {item.icon &&
                                      <item.icon
                                        className="h-4 w-4 shrink-0 mr-2 text-accent-foreground/50"
                                        aria-hidden="true"
                                      />
                                    }
                                    {!item.icon && FolderIcon &&
                                      <FolderIcon
                                        className="h-4 w-4 shrink-0 mr-2 text-accent-foreground/50"
                                        aria-hidden="true"
                                      />
                                    }
                                    <span className="text-sm truncate">{item.name}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pl-6">
                                    <FileSystemItem
                                      data={item.children ? item.children : item}
                                      selectedItemId={selectedItemId}
                                      handleSelectChange={handleSelectChange}
                                      expandedItemIds={expandedItemIds}
                                      FolderIcon={FolderIcon}
                                      ItemIcon={ItemIcon}
                                    />
                                </AccordionContent>
                            </AccordionPrimitive.Item>
                        </AccordionPrimitive.Root>
                      ) : (
                        <Leaf
                          item={item}
                          isSelected={selectedItemId === item.id}
                          onClick={() => handleSelectChange(item)}
                          Icon={ItemIcon}
                        />
                      )}
                  </li>
                ))
              ) : (
                <li>
                    <Leaf
                      item={data}
                      isSelected={selectedItemId === data.id}
                      onClick={() => handleSelectChange(data)}
                      // Icon={ItemIcon}
                    />
                </li>
              )}
          </ul>
      </div>
    );
})

const Leaf = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
    item: FileSystemItem;
    isSelected?: boolean;
    onCreateFile?: (parentId: string) => void;
    onCreateFolder?: (parentId: string) => void;
    onDelete?: (item: FileSystemItem) => void;
}>(({className, item, isSelected, onCreateFile, onCreateFolder, onDelete, ...props}, ref) => {
    const Icon = item.icon || (item.type === 'folder' ? Folder : File);
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center py-2 px-2 cursor-pointer hover:before:opacity-100 before:absolute before:left-0 before:right-1 before:w-full before:opacity-0 before:bg-muted/80 before:h-[1.75rem] before:-z-10",
          className,
          isSelected && "before:opacity-100 before:bg-accent text-accent-foreground before:border-l-2 before:border-l-accent-foreground/50 dark:before:border-0"
        )}
        {...props}
      >
          <Icon className="h-4 w-4 shrink-0 mr-2 text-accent-foreground/50" aria-hidden="true" />
          <span className="flex-grow text-sm truncate">{item.name}</span>
          {item.type === 'folder' && (
            <>
                <button onClick={() => onCreateFile && onCreateFile(item.id)} className="ml-2">+File</button>
                <button onClick={() => onCreateFolder && onCreateFolder(item.id)} className="ml-2">+Folder</button>
            </>
          )}
          <button onClick={() => onDelete && onDelete(item)} className="ml-2">Delete</button>
      </div>
    );
});

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({className, children, ...props}, ref) => (
  <AccordionPrimitive.Header>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 w-full items-center py-2 transition-all last:[&[data-state=open]>svg]:rotate-90",
          className
        )}
        {...props}
      >
          {children}
          {/*<ChevronRight*/}
          {/*  className="h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50 ml-auto"/>*/}
      </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({className, children, ...props}, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
      <div className="pb-1 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export {FileSystemTree, type FileSystemItem};
