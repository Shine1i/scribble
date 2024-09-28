"use client";

import React, { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/tailwind/ui/context-menu";
import { Dialog, DialogContent } from "@/components/tailwind/ui/dialog";
import { CreateNote, CreateNoteContent } from "@/components/note";
import { Button } from "@/components/tailwind/ui/button";
import { PlusIcon, Lock, UnlockIcon } from "lucide-react";
import SideBar from "./sidebar";
import {
  MultipleDialogContent,
  MultipleDialogContents,
  MultipleDialogs,
  MultipleDialogTrigger,
  MultipleDialogTriggers,
} from "@/components/tailwind/ui/multipleDialogs";
import AIChatComponent from "../ai/aiDashboard";
import { useEditorStore } from "@/hooks/use-editor-store";
import { useFileSystemStore } from "@/hooks/use-file-system";

export default function MarkdownEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openDialog, setOpenDialog] = useState<string>("");
  // TODO: sent to email.
  const { charsCount, editorInstance } = useEditorStore();
  const [editable, setEditable] = useState(false);

  const toggleEditable = () => {
    const newEditableState = !editable;
    setEditable(newEditableState);
    editorInstance?.setEditable(newEditableState);
  };
  const { saveStatus } = useFileSystemStore();
  return (
    <div className="flex flex-row w-full h-full ">
      {/* Sidebar on desktop */}
      <div className="max-h-full">
        <MultipleDialogs openDialog={openDialog} setOpenDialog={setOpenDialog}>
          <MultipleDialogTriggers>
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="w-64 h-full max-h-full">
                  <SideBar />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-64 *:cursor-pointer">
                <MultipleDialogTrigger id="new-file">
                  <ContextMenuItem>New File</ContextMenuItem>
                </MultipleDialogTrigger>
                <MultipleDialogTrigger id="new-folder">
                  <ContextMenuItem>New Folder</ContextMenuItem>
                </MultipleDialogTrigger>
              </ContextMenuContent>
            </ContextMenu>
          </MultipleDialogTriggers>
          <MultipleDialogContents>
            <MultipleDialogContent id="new-file">
              <CreateNoteContent
                onSubmit={() => {
                  setOpenDialog("");
                }}
              />
            </MultipleDialogContent>
            <MultipleDialogContent id="new-folder">
              <p>New Folder</p>
            </MultipleDialogContent>
          </MultipleDialogContents>
        </MultipleDialogs>
      </div>

      {/* Content */}
      <main className=" max-h-[100vh] flex flex-1 flex-col rounded-lg lg:mb-5  lg:min-w-0 lg:mr-2 lg:mt-2  overflow-x-hidden bg-[hsl(var(--editor-background))]">
        <div
          className="h-full
         bg-[hsl(var(--editor-background))]
          text-card-foreground
          rounded-lg"
        >
          {children}
        </div>
        <footer className={"bottom-0 fixed w-full "}>
          <div className="flex  items-end justify-end gap-2 pr-72  w-full bg-background">
            <div className="flex items-center gap-2 p-0.5">
              <div className="rounded-lg cursor-pointer px-2 text-sm hover:text-foreground text-muted-foreground">
                {editable ? (
                  <UnlockIcon className="size-4" onClick={toggleEditable} />
                ) : (
                  <Lock className="size-4" onClick={toggleEditable} />
                )}
              </div>
              <div className="rounded-lg  px-2  text-sm text-muted-foreground">
                {saveStatus}
              </div>
              <div className="rounded-lg  px-2  text-sm text-muted-foreground">
                {charsCount} words
              </div>
              <div className="rounded-lg  px-2  text-sm text-muted-foreground">
                {editorInstance?.storage.characterCount.characters()} characters
              </div>
            </div>
          </div>
        </footer>
      </main>
      {/* Side bar for ai */}
      {/*<nav className="w-full h-full">*/}
      {/*  <AIChatComponent />*/}
      {/*</nav>*/}
    </div>
  );
}
