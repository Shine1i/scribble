import { FileSystemItem } from "@/lib/interfaces/IFileInterfaces";
import { fileManager } from "@/lib/managers/FileManager";
import { create } from "zustand";
import { EditorInstance } from "novel";

interface FileSystemStore {
  currentFilePath: string | null;
  fileSystem: FileSystemItem[];
  saveStatus: string;
  renamingItem: string | null;
  newName: string;

  setCurrentFilePath: (path: string | null) => void;
  setFileSystem: (items: FileSystemItem[]) => void;
  setSaveStatus: (status: string) => void;
  setRenamingItem: (itemId: string | null) => void;
  setNewName: (name: string) => void;

  saveCurrentFile: (editorInstance: EditorInstance | null) => Promise<void>;
  handleSelectChange: (
    item: FileSystemItem,
    editorInstance: EditorInstance | null,
  ) => Promise<void>;
  handleRename: (item: FileSystemItem) => void;
  handleRenameSubmit: (item: FileSystemItem) => Promise<void>;
  handleDelete: (item: FileSystemItem) => Promise<void>;
}

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  currentFilePath: null,
  fileSystem: [],
  saveStatus: "Saved",
  renamingItem: null,
  newName: "",

  setCurrentFilePath: (path) => set({ currentFilePath: path }),
  setFileSystem: (items) => set({ fileSystem: items }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setRenamingItem: (itemId) => set({ renamingItem: itemId }),
  setNewName: (name) => set({ newName: name }),

  saveCurrentFile: async (editorInstance) => {
    const { currentFilePath } = get();
    console.log({ currentFilePath });
    if (!currentFilePath || !editorInstance) {
      console.error("No file path specified or editor instance is null");
      return;
    }
    try {
      await fileManager.saveFile(
        currentFilePath,
        JSON.stringify(editorInstance.getJSON()),
      );
      set({ saveStatus: "Saved" });
    } catch (error) {
      console.error("Failed to save file:", error);
    }
  },

  handleSelectChange: async (item, editorInstance) => {
    const content = await fileManager.getFileContent(item.path);
    editorInstance?.commands.setContent(JSON.parse(content));
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
}));
