"use client";

import React, { useState } from "react";
import { NavbarItem } from "./navbar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";
import { Dialog, DialogContent } from "./dialog";
import { CreateNote, CreateNoteContent } from "@/components/note";
import { Button } from "@/components/tailwind/ui/button";
import { PlusIcon } from "lucide-react";

export function SidebarLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  let [showSidebar, setShowSidebar] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<string>("");

  // @ts-ignore
  return (
    <div className="relative flex flex-row w-full h-full">
      {/* Sidebar on desktop */}
      <div>
        <Dialog open={!!dialogOpen} onOpenChange={() => setDialogOpen("")}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="w-64 h-full">{sidebar}</div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64 *:cursor-pointer">
              <ContextMenuItem onClick={() => setDialogOpen("new-file")}>
                New File
              </ContextMenuItem>
              <ContextMenuItem>New Folder</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <DialogContent>
            {dialogOpen === "new-file" && (
              <CreateNoteContent onSubmit={() => setDialogOpen("")} />
            )}
          </DialogContent>
        </Dialog>
      </div>
      {/* Navbar on mobile */}
      {/*       <header className="flex items-center px-4 lg:hidden">
        <div className="py-2.5">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header> */}

      {/* Content */}
      <main className="flex h-full max-h-[100vh] w-full overflow-auto flex-col pb-2">
        <div
          className="grow
             bg-card
              text-card-foreground
              rounded-lg"
        >
          {/*max-w-6xl*/}
          <div className="mx-auto w-full h-full">{children}</div>
        </div>
      </main>
      <CreateNote>
        <Button
          size={"icon"}
          variant={"ghost"}
          className={"rounded-none h-8 w-8"}
        >
          <PlusIcon className={"size-5"} />
        </Button>
      </CreateNote>
    </div>
  );
}
