"use client";
import MarkdownEditor from "@/components/tailwind/advanced-editor";
import { SidebarLayout } from "@/components/tailwind/ui/sidebar-layout";

import * as React from "react";
import { useEffect, useRef } from "react";
import { useEditorStore } from "@/hooks/use-editor-store";
import { File, Folder, Tree } from "@/components/tailwind/ui/Tree";
import { FileSystemItem } from "@/lib/interfaces/IFileInterfaces";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/tailwind/ui/context-menu";
import { useFileSystemStore } from "@/hooks/use-file-system";
import { Command } from "@tauri-apps/plugin-shell";
import { convertMarkdownFileToHtml, exportNote } from "@/lib/utils";
import { documentDir } from "@tauri-apps/api/path";
import { Button } from "@/components/tailwind/ui/button";
import { ListTree, PlusIcon } from "lucide-react";
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
import { ToC } from "@/components/tailwind/ui/toc";

export default function Page() {
  const {
    fileSystem,
    renamingItem,
    setFileSystem,
    getFileSystem,
    setRenamingItem,
    newName,
    setNewName,
    handleRename,
    handleRenameSubmit,
    setCurrentFilePath,
    handleDelete,
  } = useFileSystemStore();
  const MemorizedToC = React.memo(ToC);
  const { editorInstance, tocItems } = useEditorStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getFileSystem();
  }, []);

  useEffect(() => {
    /*     async function exportCurrentNote(outputFormat: string) {
      const inputPath = "/home/wasim/Documents/Scribble/output.html";
      const noteName = "MyNote"; // This should be dynamically set based on the current note
      try {
        const exportedPath = await exportNote(
          inputPath,
          noteName,
          outputFormat,
        );
        if (exportedPath) {
          console.log(`Note exported successfully to: ${exportedPath}`);
          // You might want to update UI or state here to reflect the successful export
        }
      } catch (error) {
        console.error("Failed to export note:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }

    // Example usage:
    exportCurrentNote("docx"); // or 'docx', 'pdf', 'txt', etc. */
  }, []);
  useEffect(() => {
    if (renamingItem && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [renamingItem]);

  useEffect(() => {
    // Set the url to the server if running in Tauri. This is a Ref.
    // Import tauri command and execute the sidecar process
    startServer().then((r) => {
      console.log(r);
    });
    console.log("running");
  }, []);

  async function startServer() {
    const command = Command.sidecar("binaries/server");
    const test = await command.execute();
    console.log(test);
  }

  const handleSelectChange = async (item: FileSystemItem) => {
    setCurrentFilePath(item.path);
  };

  const renderFileSystemItems = (items: FileSystemItem[]): React.ReactNode => {
    if (!editorInstance) return null;
    return items.map((item) => {
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
                {renderFileSystemItems(item.children)}
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
    });
  };

  return (
    <SidebarLayout
      navbar={false}
      sidebar={
        <div className={"h-full"}>
          <Tabs defaultValue="files" className="w-full h-full">
            <TabsList className={"w-full"}>
              <TabsTrigger className={"w-full"} value="files">
                Files
              </TabsTrigger>
              <TabsTrigger className={"w-full"} value="outlines">
                Outlines
              </TabsTrigger>
            </TabsList>

            <TabsContent className={"h-full relative"} value="files">
              <Tree
                className="h-full p-2 "
                initialExpandedItems={[]}
                elements={fileSystem}
              >
                {renderFileSystemItems(fileSystem)}
              </Tree>
              <div
                className={
                  "flex items-center absolute bottom-12 w-full justify-between"
                }
              >
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
                  <MemorizedToC editor={editorInstance} items={tocItems} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      }
    >
      <MarkdownEditor />
    </SidebarLayout>
  );
}
