import { create } from "zustand";
import { EditorInstance } from "novel";
import { BaseDirectory, readDir } from "@tauri-apps/plugin-fs";
import { FileSystemItem } from "@/lib/fileManager/types";
import { fileManager } from "@/lib/fileManager";
import { useEditorStore } from "./use-editor-store";
import { convertMarkdownFileToHtml } from "@/lib/utils";
import { documentDir } from "@tauri-apps/api/path";

export enum SaveStatus {
  Saved = "Saved",
  Unsaved = "Unsaved",
}

interface FileSystemStore {
  currentFilePath: string | null;
  fileSystem: FileSystemItem[];
  saveStatus: SaveStatus;
  renamingItem: string | null;
  newName: string;
    tabs: FileSystemItem[];
    activeTab: string | null;
  setFileSystem: (items: FileSystemItem[]) => void;
  setSaveStatus: (status: SaveStatus) => void;
  setRenamingItem: (itemId: string | null) => void;
  setNewName: (name: string) => void;
    openTab: (item: FileSystemItem) => void;
    closeTab: (itemId: string) => void;
    setActiveTab: (itemId: string) => void;
  getFileSystem: () => Promise<FileSystemItem[]>;

  createFile: ({
    name,
    payload,
  }: {
    name: string;
    payload?: string;
  }) => Promise<FileSystemItem>;

  saveCurrentFile: () => Promise<void>;
  handleSelectChange: (item: FileSystemItem) => Promise<void>;
  handleRename: (item: FileSystemItem) => void;
  handleRenameSubmit: (item: FileSystemItem) => Promise<void>;
  handleDelete: (item: FileSystemItem) => Promise<void>;
}

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  currentFilePath: null,
  fileSystem: [],
  saveStatus: SaveStatus.Saved,
  renamingItem: null,
  newName: "",
    tabs: [],
    activeTab: null,
  setFileSystem: (items) => set({ fileSystem: items }),
  getFileSystem: async () => {
    try {
      await fileManager.initializeFileSystem();
      const systemItems = await fileManager.retrieveFileSystem();
      set({ fileSystem: systemItems });
      return systemItems;
    } catch (error) {
      console.error("Error initializing or retrieving file system:", error);
      return [];
    } finally {
      console.log("File system initialization process completed.");
    }
  },

  createFile: async ({ name, payload }: { name: string; payload?: string }) => {
    if (!name.trim()) throw new Error("Name cannot be empty");
    if (!name.endsWith(".md")) name += ".md";

    const systemItem = await fileManager.createFile(BaseDirectory.Document, {
      name,
      payload: payload || "",
    });

    get().getFileSystem();
    return systemItem;
  },

  setSaveStatus: (status) => set({ saveStatus: status }),
  setRenamingItem: (itemId) => set({ renamingItem: itemId }),
  setNewName: (name) => set({ newName: name }),

  saveCurrentFile: async () => {
    const { currentFilePath } = get();
    const { editorInstance } = useEditorStore.getState();

    if (!currentFilePath || !editorInstance) {
      console.error("No file path specified or editor instance is null");
      return;
    }
    try {
      const markdown = editorInstance.storage.markdown.getMarkdown();
      console.log("markdown", markdown);
      await fileManager.saveFile(
        currentFilePath,
        markdown,
      );
      set({ saveStatus: SaveStatus.Saved });
    } catch (error) {
      console.error("Failed to save file:", error);
    }
  },

  handleSelectChange: async (item) => {
    const { saveStatus, saveCurrentFile } = get();
    if (saveStatus === SaveStatus.Unsaved) {
      await saveCurrentFile();
    }

    set({ currentFilePath: item.path });
  },

  handleRename: (item) => {
    set({ renamingItem: item.id, newName: item.name });
  },

  handleRenameSubmit: async (item) => {
    const { newName, fileSystem } = get();
    if (newName.trim() === "") return;

    const oldPath = item.path;
    const newPath = oldPath.replace(item.name, newName);
    try {
      if (item.children) {
        await fileManager.renameDirectory(oldPath, newPath);
      } else {
        await fileManager.renameFile(oldPath, newPath);
      }
      const updatedFileSystem = await fileManager.retrieveFileSystem();
      set({ fileSystem: updatedFileSystem, renamingItem: null });
    } catch (error) {
      console.error("Error renaming item:", error);
    }
  },

  handleDelete: async (item) => {
    if (item.children) {
      console.log("directory");
    } else {
      await fileManager.deleteFile(item.path);
    }
    const updatedFileSystem = await fileManager.retrieveFileSystem();
    set({ fileSystem: updatedFileSystem });
  },
    openTab: (item) => set((state) => {
        if (!state.tabs.some(tab => tab.id === item.id)) {
            return {tabs: [...state.tabs, item], activeTab: item.id};
        }
        return {activeTab: item.id};
    }),

    closeTab: (itemId) => set((state) => {
        const newTabs = state.tabs.filter(tab => tab.id !== itemId);
        const newActiveTab = state.activeTab === itemId
            ? newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null
            : state.activeTab;
        return {tabs: newTabs, activeTab: newActiveTab};
    }),

    setActiveTab: (itemId) => set({activeTab: itemId}),
}));
