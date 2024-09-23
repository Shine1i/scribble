import { create } from "zustand";
import { tauriPersist } from "@/hooks/tauri-persist";

interface ThemeStore {
  appColors: Record<string, string>;
  editorColors: Record<string, string>;
  setAppColor: (key: string, value: string) => void;
  setEditorColor: (key: string, value: string) => void;
  setAppTheme: (theme: Record<string, string>) => void;
  setEditorTheme: (theme: Record<string, string>) => void;
}

export const useThemeStore = create<ThemeStore>()(
  tauriPersist("theme-store", (set) => ({
    appColors: {
      background: "210 20% 98%",
      foreground: "240 10% 3.9%",
      card: "53 74% 91%",
      "card-foreground": "240 10% 3.9%",
      popover: "53 74% 91%",
      "popover-foreground": "240 10% 3.9%",
      primary: "167 77.2% 49.8%",
      "primary-foreground": "167 100% 97.3%",
      secondary: "0 100% 67%",
      "secondary-foreground": "167 5.9% 10%",
      muted: "167 4.8% 95.9%",
      "muted-foreground": "167 3.8% 46.1%",
      accent: "167 4.8% 95.9%",
      "accent-foreground": "167 5.9% 10%",
      destructive: "0 62.8% 30.6%",
      "destructive-foreground": "0 85.7% 97.3%",
      border: "167 5.9% 90%",
      input: "167 5.9% 90%",
      ring: "167 77.2% 49.8%",
    },
    editorColors: {
      background: "0 0% 100%",
      foreground: "0 0% 0%",
      syntax: "240 100% 50%",
    },
    setAppColor: (key, value) =>
      set((state) => ({
        appColors: { ...state.appColors, [key]: value },
      })),
    setEditorColor: (key, value) =>
      set((state) => ({
        editorColors: { ...state.editorColors, [key]: value },
      })),
    setAppTheme: (theme) => set({ appColors: theme }),
    setEditorTheme: (theme) => set({ editorColors: theme }),
  })),
);
