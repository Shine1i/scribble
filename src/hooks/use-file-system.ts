import { FileSystemItem } from "@/lib/interfaces/IFileInterfaces";
import { fileManager } from "@/lib/managers/FileManager";
import { create } from "zustand";
import { EditorInstance } from "novel";
import { documentDir } from "@tauri-apps/api/path";
import { convertMarkdownFileToHtml } from "@/lib/utils";
import { useEditorStore } from "@/hooks/use-editor-store";

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

  getFileSystem: () => Promise<FileSystemItem[]>;

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

  setCurrentFilePath: async (path) => {
    /*    const {editorInstance} = useEditorStore.getState()
    const html = await convertMarkdownFileToHtml(
      (await documentDir()) + "/" + path,
    );
    console.log(html, "html");
    editorInstance?.commands.setContent(html);*/
    set({ currentFilePath: path });
  },
  setFileSystem: (items) => set({ fileSystem: items }),
  getFileSystem: async () => {
    try {
      await fileManager.initializeFileSystem();
      console.log("File system initialized successfully.");
      const systemItems = await fileManager.retrieveFileSystem();
      console.log("File system retrieved successfully.");
      set({ fileSystem: systemItems });
      return systemItems;
    } catch (error) {
      console.error("Error initializing or retrieving file system:", error);
      return [];
    } finally {
      console.log("File system initialization process completed.");
    }
  },

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
        editorInstance.storage.markdown.getMarkdown(),
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
