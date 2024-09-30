import { create } from "zustand";
import { tauriPersist } from "@/hooks/tauri-persist";

interface ThemeState {
  appColors: Record<string, string>;
  editorColors: Record<string, string>;
  customThemes: Record<string, Record<string, string>>;
  setAppColor: (key: string, value: string) => void;
  setEditorColor: (key: string, value: string) => void;
  setAppTheme: (theme: Record<string, string>) => void;
  setEditorTheme: (theme: Record<string, string>) => void;
  saveCustomTheme: (name: string, theme: Record<string, string>) => void;
}

export const useThemeStore = create<ThemeState>()(
  tauriPersist("theme-storage", (set) => ({
    appColors: {
        background: "220 16.36% 21.57%",
        foreground: "218 27% 94%",
        card: "222 16% 28%",
        "card-foreground": "0 0% 95%",
        popover: "220 16.48% 35.69%",
        "popover-foreground": "0 0% 95%",
        primary: "210 34% 63%",
        "primary-foreground": "167 100% 10.3%",
      secondary: "0 100% 67%",
        "secondary-foreground": "0 0% 98%",
        muted: "245.71 24.14% 17.06%",
        "muted-foreground": "167 5% 64.9%",
        accent: "220 17% 32%",
        "accent-foreground": "0 0% 98%",
      destructive: "0 62.8% 30.6%",
      "destructive-foreground": "0 85.7% 97.3%",
        border: "220 16% 22%",
        input: "247.5 23.53% 20%",
      ring: "167 77.2% 49.8%",
    },
    editorColors: {
        background: "220 17% 17%",
        fg: "218 27% 94%",
        heading: "210 34% 63%",
        lead: "60 30% 96%",
        link: "210 34% 63%",
        bold: "60 30% 96%",
        counter: "60 30% 96%",
        bullet: "248 15% 60.78%",
        hr: "247.5 13.19% 35.69%",
        quote: "231 15% 74%",
        "quote-border": "210 34% 63%",
        caption: "231 15% 74%",
        "inline-code": "0 0% 89%", // Converted #e0def4 to HSL
        "pre-code": "60 30% 96%",
        "pre-bg": "220 16.36% 21.57%",
        "th-border": "232 14% 31%",
        "td-border": "233 14% 26%",
        h1: "210 34% 63%",
        h2: "210 34% 63%",
        h3: "210 34% 63%",
        h4: "210 34% 63%",
        h5: "210 34% 63%",
        h6: "210 34% 63%",
    },
    customThemes: {},
    setAppColor: (key, value) =>
      set((state) => ({ appColors: { ...state.appColors, [key]: value } })),
    setEditorColor: (key, value) =>
      set((state) => ({
        editorColors: { ...state.editorColors, [key]: value },
      })),
    setAppTheme: (theme) => set({ appColors: theme }),
    setEditorTheme: (theme) => set({ editorColors: theme }),
    saveCustomTheme: (name, theme) =>
      set((state) => ({
        customThemes: { ...state.customThemes, [name]: theme },
      })),
  })),
);