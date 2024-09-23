// components/ThemeLoader.tsx
import { useThemeStore } from "@/hooks/use-theme-store";
import { useEffect } from "react";

export function ThemeLoader() {
  const { appColors, editorColors } = useThemeStore();

  useEffect(() => {
    const applyTheme = () => {
      Object.entries(appColors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
      });
      Object.entries(editorColors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--editor-${key}`, value);
      });
    };

    applyTheme();
  }, [appColors, editorColors]);

  return null; // This component doesn't render anything
}
