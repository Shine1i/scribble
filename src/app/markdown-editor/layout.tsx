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
import { PlusIcon } from "lucide-react";
import SideBar from "./sidebar";
import {
  MultipleDialogContent,
  MultipleDialogContents,
  MultipleDialogs,
  MultipleDialogTrigger,
  MultipleDialogTriggers,
} from "@/components/tailwind/ui/multipleDialogs";
import AIChatComponent from "../ai/aiDashboard";

export default function MarkdownEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openDialog, setOpenDialog] = useState<string>("");

  return (
    <div className="flex flex-row w-full h-full">
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
      <main className="w-full h-full max-h-[100vh] p-2 overflow-auto">
        <div
          className="h-full
          bg-card
          text-card-foreground
          rounded-lg"
        >
          {children}
        </div>
      </main>

      {/* Side bar for ai */}
      <nav className="w-full h-full">
        <AIChatComponent />
      </nav>
    </div>
  );
}
