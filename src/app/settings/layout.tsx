"use client";

import { Button } from "@/components/tailwind/ui/button";
import {
  TabsList,
  Tabs,
  TabsTrigger,
  TabsContent,
} from "@/components/tailwind/ui/tabs";
import { Store } from "@tauri-apps/plugin-store";

export default ({
  children,
  general,
  theme,
}: {
  children: React.ReactNode;
  general: React.ReactNode;
  theme: React.ReactNode;
}) => {
  const clearStore = () => {
    const store = new Store("settings.bin");
    store.clear();
  };

  return (
    <div className={"w-full h-full p-5 flex justify-center"}>
      <Tabs defaultValue="general" className={"w-full max-w-screen-xl"}>
        <TabsList className={"w-full max-w-screen-xl"}>
          <TabsTrigger value="general" className={"w-full"}>
            General
          </TabsTrigger>
          <TabsTrigger value="theme" className={"w-full"}>
            Theme
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">{general}</TabsContent>
        <TabsContent value="theme">{theme}</TabsContent>
        <Button onClick={clearStore}>Clear Store</Button>
      </Tabs>
    </div>
  );
};
