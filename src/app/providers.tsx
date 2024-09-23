"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import useLocalStorage from "../hooks/use-local-storage";
import { ThemeLoader } from "./settings/@theme/ThemeLoader";
import { useThemeStore } from "@/hooks/use-theme-store";
export const AppContext = createContext<{
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
}>({
  font: "Default",
  setFont: () => {},
});

const ToasterProvider = () => {
  const { theme } = useTheme() as {
    theme: "light" | "dark" | "system";
  };
  return <Toaster theme={theme} />;
};

export default function Providers({ children }: { children: ReactNode }) {
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");

  // @ts-ignore
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      <AppContext.Provider
        value={{
          font,
          // @ts-ignore
          setFont,
        }}
      >
        <ThemeLoader />
        <ToasterProvider />
        {children}
      </AppContext.Provider>
    </ThemeProvider>
  );
}
