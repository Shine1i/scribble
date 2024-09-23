"use client";

import { create, StateCreator } from "zustand";

export default function ThemePage() {
  return (
    <div>
      <ThemeColorChanger />
    </div>
  );
}
// components/ThemeSettings.tsx

import React, { useEffect, useState } from "react";
import { Button } from "@/components/tailwind/ui/button";
import { Label } from "@/components/tailwind/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tailwind/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tailwind/ui/select";
import { useThemeStore } from "@/hooks/use-theme-store";
import { ColorPicker } from "@/app/settings/@theme/ColorPicker";
import { hexToHsl } from "@/lib/themes/colorConversion";
import { predefinedEditorThemes, predefinedThemes } from "@/lib/themes/themes";
import { Input } from "@/components/tailwind/ui/input";

export function ThemeColorChanger() {
  const {
    appColors,
    editorColors,
    customThemes,
    setAppColor,
    setEditorColor,
    setAppTheme,
    setEditorTheme,
    saveCustomTheme,
  } = useThemeStore();

  const [newThemeName, setNewThemeName] = useState("");

  useEffect(() => {
    Object.entries(appColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
    Object.entries(editorColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--editor-${key}`, value);
    });
  }, [appColors, editorColors]);

  const handleColorChange = (
    colorSet: "app" | "editor",
    key: string,
    value: string,
  ) => {
    if (colorSet === "app") {
      setAppColor(key, value);
    } else {
      setEditorColor(key, value);
    }
  };

  const handleThemeChange = (colorSet: "app" | "editor", theme: string) => {
    const allThemes = { ...predefinedThemes, ...customThemes };
    if (colorSet === "app") {
      setAppTheme(allThemes[theme]);
    } else {
      setEditorTheme(
        predefinedEditorThemes[theme as keyof typeof predefinedEditorThemes],
      );
    }
  };

  const handleSaveCustomTheme = () => {
    if (newThemeName) {
      saveCustomTheme(newThemeName, appColors);
      setNewThemeName("");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-background rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        Theme Color Changer
      </h2>

      <Tabs defaultValue="app">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="app">App Theme</TabsTrigger>
          <TabsTrigger value="editor">Markdown Editor</TabsTrigger>
        </TabsList>
        <TabsContent value="app" className="space-y-4">
          <div className="space-y-4 flex flex-wrap justify-between">
            {Object.entries(appColors).map(([key, value]) => (
              <ColorPicker
                key={key}
                colorSet="app"
                colorKey={key}
                color={value}
                onColorChange={handleColorChange}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Label>Predefined App Themes</Label>
            <Select onValueChange={(theme) => handleThemeChange("app", theme)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys({ ...predefinedThemes, ...customThemes }).map(
                  (theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Save Custom Theme</Label>
            <div className="flex space-x-2">
              <Input
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="Enter theme name"
              />
              <Button onClick={handleSaveCustomTheme}>Save Theme</Button>
            </div>
          </div>
          <div className="flex space-x-4">
            {["primary", "secondary", "accent"].map((key) => (
              <div
                key={key}
                className="w-20 h-20 rounded-full"
                style={{ backgroundColor: `hsl(${appColors[key]})` }}
              ></div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="editor" className="space-y-4">
          <div className="space-y-4 flex flex-wrap justify-between">
            {Object.entries(editorColors).map(([key, value]) => (
              <ColorPicker
                key={key}
                colorSet="editor"
                colorKey={key}
                color={value}
                onColorChange={handleColorChange}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Label>Predefined Editor Themes</Label>
            <Select
              onValueChange={(theme) => handleThemeChange("editor", theme)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(predefinedEditorThemes).map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div
            className="p-4 rounded-md"
            style={{
              backgroundColor: `hsl(${editorColors.background})`,
              color: `hsl(${editorColors.text})`,
            }}
          >
            <p>Sample Markdown</p>
            <p style={{ color: `hsl(${editorColors.syntax})` }}># Heading</p>
            <p>Normal text</p>
            <p style={{ color: `hsl(${editorColors.syntax})` }}>
              **Bold text**
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
