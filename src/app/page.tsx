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
import { fileManager } from "@/lib/managers/FileManager";
import { useFileSystemStore } from "@/hooks/use-file-system";
import { Command } from "@tauri-apps/plugin-shell";
import { save } from "@tauri-apps/plugin-dialog";
import { convertMarkdownFileToHtml, exportNote } from "@/lib/utils";
import { toast } from "sonner";
import { documentDir } from "@tauri-apps/api/path";
export default function Page() {
  const {
    fileSystem,
    renamingItem,
    setFileSystem,
    setRenamingItem,
    newName,
    setNewName,
    handleRename,
    handleRenameSubmit,
    setCurrentFilePath,
    handleDelete,
  } = useFileSystemStore();

  const { editorInstance } = useEditorStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fileManager
      .initializeFileSystem()
      .then(() => {
        console.log("File system initialized successfully.");
        return fileManager.retrieveFileSystem();
      })
      .then((fs) => {
        console.log("File system retrieved successfully.");
        setFileSystem(fs);
      })
      .catch((error) => {
        console.error("Error initializing or retrieving file system:", error);
      })
      .finally(() => {
        console.log("File system initialization process completed.");
      });
  }, []);
  useEffect(() => {
    async function exportCurrentNote(outputFormat: string) {
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
    exportCurrentNote("docx"); // or 'docx', 'pdf', 'txt', etc.
  }, []);
  useEffect(() => {
    if (renamingItem && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [renamingItem]);

  const handleSelectChange = async (item: FileSystemItem) => {
    setCurrentFilePath(item.path);
    console.log(item.path);
    const html = await convertMarkdownFileToHtml(
      (await documentDir()) + "/" + item.path,
    );
    console.log(html, "html");
    editorInstance?.commands.setContent(html);
    // console.log(editorInstance?.getHTML());
  };

  const renderFileSystemItems = (items: FileSystemItem[]): React.ReactNode => {
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
        <Tree
          className="p-2 overflow-hidden rounded-md bg-background"
          initialExpandedItems={[]}
          elements={fileSystem}
        >
          {renderFileSystemItems(fileSystem)}
        </Tree>
      }
    >
      <MarkdownEditor />
    </SidebarLayout>
  );
}
