"use client";
import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import { ReactNode, useEffect } from "react";
import Providers from "./providers";
import { Command } from "@tauri-apps/plugin-shell";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
