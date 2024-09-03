import "@/styles/globals.css";
import "@/styles/prosemirror.css";
import type { ReactNode } from "react";
import Providers from "./providers";


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body>
    <Providers>{children}</Providers>
    </body>
    </html>
  );
}
