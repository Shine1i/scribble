"use client";
import { useFileSystemStore } from "@/hooks/use-file-system";
import { useEditorStore } from "@/hooks/use-editor-store";
import { Button } from "@/components/tailwind/ui/button";
import { ToC } from "@/components/tailwind/ui/toc";
import { ListTree, PlusIcon } from "lucide-react";
import { memo, useEffect, useRef } from "react";
import { CreateNote } from "@/components/note";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/tailwind/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tailwind/ui/tabs";
import { File, Folder, Tree } from "@/components/tailwind/ui/Tree";
import { FileSystemItem } from "@/lib/fileManager/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/tailwind/ui/context-menu";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";

export default function SideBar() {
  const { fileSystem, getFileSystem } = useFileSystemStore();
  const MemorizedToC = memo(ToC);
  const { editorInstance, tocItems } = useEditorStore();

  useEffect(() => {
    getFileSystem();
  }, []);

  return (
    <div className={"flex flex-col p-2 h-full"}>
      <Tabs className={"flex flex-col  h-full"} defaultValue="files">
        <TabsList className={"w-full"}>
          <TabsTrigger className={"w-full"} value="files">
            Files
          </TabsTrigger>
          <TabsTrigger className={"w-full"} value="outlines">
            Outlines
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="files"
          className="overflow-hidden flex flex-col h-full data-[state=inactive]:hidden"
        >
          <ScrollArea className="flex-grow ">
            <div className="p-2">
              <Tree initialExpandedItems={[]} elements={fileSystem}>
                <FileSystemRenderer items={fileSystem} />
              </Tree>
            </div>
          </ScrollArea>

          <div className={"flex w-full justify-between"}>
            <CreateNote>
              <Button
                size={"icon"}
                variant={"ghost"}
                className={"rounded-none h-8 w-8"}
              >
                <PlusIcon className={"size-5"} />
              </Button>
            </CreateNote>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={
                  "text-sm text-muted-foreground hover:text-foreground"
                }
              >
                Synced at 14:27:15
              </DropdownMenuTrigger>
              <DropdownMenuContent className={"w-[200px]"}>
                <DropdownMenuLabel>NextCloud</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sync Now</DropdownMenuItem>
                <DropdownMenuItem>Logs</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size={"icon"}
              variant={"ghost"}
              className={"rounded-none h-8 w-8"}
            >
              <ListTree className={"size-5"} />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="outlines">
          <div className="sidebar-options">
            <div className="label-large">Table of contents</div>
            <div className="table-of-contents">
              <MemorizedToC editor={editorInstance} items={tocItems as any} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const FileSystemRenderer: React.FC<{
  items: FileSystemItem[];
}> = ({ items }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { handleSelectChange } = useFileSystemStore();

  const {
    renamingItem,
    setRenamingItem,
    newName,
    setNewName,
    handleRename,
    handleRenameSubmit,
    handleDelete,
  } = useFileSystemStore();

  useEffect(() => {
    if (renamingItem && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [renamingItem]);

  return (
    <>
      {items.map((item) => {
        const isRenaming = renamingItem === item.id;
        return (
          <ContextMenu key={item.id}>
            <ContextMenuTrigger>
              {item.children ? (
                <Folder
                  key={item.id}
                  isRenaming={isRenaming}
                  folderName={item.name}
                  value={item.id}
                  rename={() => handleRenameSubmit(item)}
                  newName={newName}
                  setNewName={setNewName}
                  inputRef={inputRef}
                >
                  <FileSystemRenderer items={item.children} />
                </Folder>
              ) : (
                <File
                  onClick={() => handleSelectChange(item)}
                  key={item.id}
                  value={item.id}
                >
                  {isRenaming ? (
                    <input
                      ref={inputRef}
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter") await handleRenameSubmit(item);
                        if (e.key === "Escape") setRenamingItem(null);
                      }}
                      onBlur={() => handleRenameSubmit(item)}
                    />
                  ) : (
                    <p>{item.name}</p>
                  )}
                </File>
              )}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64 *:cursor-pointer">
              <ContextMenuItem onSelect={() => handleDelete(item)}>
                Delete
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => handleRename(item)}>
                Rename
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        );
      })}
    </>
  );
};
