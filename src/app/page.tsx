'use client';
import MarkdownEditor from "@/components/tailwind/advanced-editor";
import { Button } from "@/components/tailwind/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/tailwind/ui/dialog";
import Menu from "@/components/tailwind/ui/menu";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { BookOpen, GithubIcon } from "lucide-react";
import Link from "next/link";
import {SidebarLayout} from "@/components/tailwind/ui/sidebar-layout";
import {FileSystemItem, FileSystemTree} from "@/app/test";
import * as React from "react";
import {data} from "@/app/test/page";
import {useEditorStore} from "@/hooks/use-editor-store";
import {BaseDirectory, readTextFile} from "@tauri-apps/plugin-fs";
import {fileManager} from "@/lib/managers/FileManager";
import {EditorInstance} from "novel";

export default function Page() {
    const {
        currentFilePath, editorContent, saveStatus, charsCount, fileSystem,
        setCurrentFilePath, setEditorContent, setSaveStatus, setCharsCount, setFileSystem, editorInstance
    } = useEditorStore();
    const handleSelectChange = async (item:FileSystemItem, editor: EditorInstance) => {
        if (item && item.path && item.type === 'file') {
            console.log('wow')
                const content = await fileManager.openFile(item.path);
                setEditorContent(JSON.parse(content))
            editorInstance?.commands.setContent(JSON.parse(content))
            console.log(content)
            
            setCurrentFilePath(item.path);
        }
    };
  return (
    <SidebarLayout navbar={false} sidebar={
        <FileSystemTree
          data={fileSystem}
          className="h-screen w-[90%]"
          onSelectChange={handleSelectChange}
          onCreateFile={(parentId) => console.log("Create file in:", parentId)}
          onCreateFolder={(parentId) => console.log("Create folder in:", parentId)}
          onDelete={(item) => console.log("Delete:", item)}
        />
    }>
    {/*// <div className="flex min-h-screen flex-col items-center gap-4 py-4 sm:px-5">*/}
    {/*//   <div className="flex w-full max-w-screen-lg items-center gap-2 px-4 sm:mb-[calc(20vh)]">*/}
    {/*//*/}
    {/*//     <Menu />*/}
    {/*//   </div>*/}
      
      <MarkdownEditor />
    {/*</div>*/}
    </SidebarLayout>
  );
}
