'use client';
import MarkdownEditor from "@/components/tailwind/advanced-editor";
import {SidebarLayout} from "@/components/tailwind/ui/sidebar-layout";

import * as React from "react";
import {useEditorStore} from "@/hooks/use-editor-store";
import {File, Folder, Tree} from "@/components/tailwind/ui/Tree";
import {FileSystemItem} from "@/lib/interfaces/IFileInterfaces";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from "@/components/tailwind/ui/context-menu";
import {fileManager} from "@/lib/managers/FileManager";
import {useEffect, useRef, useState} from "react";
import {useFileSystemStore} from "@/hooks/use-file-system";

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
        handleDelete
    } = useFileSystemStore();
    
    const {
        editorInstance
    } = useEditorStore();
    
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect( () => {
        fileManager.initializeFileSystem().finally(async () => {
            setFileSystem(await fileManager.retrieveFileSystem());
        });
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
        console.log(item.path)
        const content = await fileManager.getFileContent(item.path);
        editorInstance?.commands.setContent(JSON.parse(content));
    };
    
    const renderFileSystemItems = (items: FileSystemItem[]): React.ReactNode => {
        return items.map(item => {
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
                                    if (e.key === 'Enter') await handleRenameSubmit(item);
                                    if (e.key === 'Escape') setRenamingItem(null);
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
                      <ContextMenuItem onSelect={() => handleDelete(item)}>Delete</ContextMenuItem>
                      <ContextMenuItem onSelect={() => handleRename(item)}>Rename</ContextMenuItem>
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



// export function TOC  () {
//     const { tocItems, setTocItems, editorInstance } = useEditorStore();
//
//     console.log(tocItems)
//
//     const onItemClick = (e: React.MouseEvent, id: string) => {
//         e.preventDefault();
//
//         if (editorInstance) {
//             const item = tocItems.find(item => item.id === id);
//             if (item) {
//                 // Set focus
//                 const { state, view } = editorInstance;
//                 const tr = state.tr;
//                 const pos = tr.doc.resolve(item.pos);
//                 tr.setSelection(TextSelection.near(pos));
//                 view.dispatch(tr);
//                 view.focus();
//
//                 // Update URL
//                 if (history.pushState) {
//                     history.pushState(null, '', `#${id}`);
//                 }
//
//                 // Scroll to element
//                 const domNode = view.nodeDOM(item.pos) as HTMLElement;
//                 if (domNode) {
//                     setTimeout(() => {
//                         domNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                     }, 0);
//                 }
//             }
//         }
//     };
//     if (!editorInstance) {
//         return null;
//     }
//
//     return (
//       <div>
//           <div>
//               <h3>Table of Contents</h3>
//               {tocItems.length === 0 ? (
//                 <p>Start editing your document to see the outline.</p>
//               ) : (
//                 <ul>
//                     {tocItems.map((item) => (
//                       <li
//                         key={item.id}
//                         style={{ marginLeft: `${(item.level - 1) * 20}px` }}
//                         onClick={(e) => onItemClick(e, item.id)}
//                       >
//                           {item.itemIndex} {item.textContent}
//                       </li>
//                     ))}
//                 </ul>
//               )}
//           </div>
//       </div>
//     );
// };

