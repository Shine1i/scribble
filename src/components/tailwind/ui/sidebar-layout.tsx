"use client";

import React, { useState } from "react";
import { NavbarItem } from "./navbar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./context-menu";

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function CloseMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

export function SidebarLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  let [showSidebar, setShowSidebar] = useState(false);

  // @ts-ignore
  return (
    <div className="relative isolate flex min-h-svh w-full max-lg:flex-col bg-background">
      {/* Sidebar on desktop */}
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">
            {sidebar}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64 *:cursor-pointer">
          <ContextMenuItem>New File</ContextMenuItem>
          <ContextMenuItem>New Folder</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      {/* Navbar on mobile */}
      <header className="flex items-center px-4 lg:hidden">
        <div className="py-2.5">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-64 lg:pr-2 lg:pt-2">
        <div
          className="grow p-6
              bg-card
              text-card-foreground
              lg:rounded-lg lg:p-0 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:ring-white/10"
        >
          {/*max-w-6xl*/}
          <div className="mx-auto w-full h-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
