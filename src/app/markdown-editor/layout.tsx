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
import { Tabss } from "@/components/Tabss";
import { useSettings } from "@/hooks/use-settings";

export default function MarkdownEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openDialog, setOpenDialog] = useState<string>("");
  const { settings } = useSettings();
  return (
    <div className="flex flex-row w-full h-full max-w-[100vw]">
      {/* Sidebar on desktop */}
      <div className="max-h-full">
        <MultipleDialogs openDialog={openDialog} setOpenDialog={setOpenDialog}>
          <MultipleDialogTriggers>
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="md:w-64 hidden md:flex h-full max-h-full">
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
      <main className="flex flex-row h-full w-full overflow-hidden">
        <div className="flex flex-col h-full w-full min-w-0">
          <Tabss />
          <div className="flex-grow overflow-y-auto">
            {children}
          </div>
          <Footer />
        </div>
        {/* Side bar for ai */}
        {settings.ai.sidebar && (
          <nav className="w-[400px] flex-shrink-0 h-full overflow-auto">
            <AIChatComponent />
          </nav>
        )}
      </main>
    </div>
  );
}

function Footer() {
    const { charsCount, editorInstance } = useEditorStore();
    const [editable, setEditable] = useState(false);
    const { saveStatus } = useFileSystemStore();
  
    const toggleEditable = () => {
      const newEditableState = !editable;
      setEditable(newEditableState);
      editorInstance?.setEditable(newEditableState);
    };
  
    return (
      <footer className="bg-background border-t border-border">
        <div className="flex items-center justify-end px-4 py-2 text-sm text-muted-foreground">
          <button
            onClick={toggleEditable}
            className="p-1 rounded-md hover:bg-secondary transition-colors"
            aria-label={editable ? "Lock editing" : "Unlock editing"}
          >
            {editable ? (
              <UnlockIcon className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </button>
          <div className="ml-4 space-x-4">
            <span>{saveStatus}</span>
            <span>{charsCount} words</span>
            <span>{editorInstance?.storage.characterCount.characters()} characters</span>
          </div>
        </div>
      </footer>
    );
  }