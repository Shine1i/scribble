import { BaseDirectory, writeTextFile } from "@tauri-apps/plugin-fs";
import { FileSystemItem, IFileSaver } from "@/lib/interfaces/IFileInterfaces";
import { join } from "@tauri-apps/api/path";

export class FileSaver implements IFileSaver {
  async saveFile(filePath: string, content: any): Promise<void> {
    try {
      if (!filePath) return;
      await writeTextFile(filePath, content, {
        baseDir: BaseDirectory.Document,
      });
      console.log("File saved successfully");
    } catch (error) {
      console.error("Failed to save file:", error);
      throw new Error("Save operation failed");
    }
  }

  async createFile(
    baseDirectory: BaseDirectory,
    {
      name,
      payload,
    }: {
      name: string;
      payload: any;
    },
  ): Promise<FileSystemItem> {
    try {
      const path = await join("Scribble", name);

      await writeTextFile(path, payload, {
        baseDir: baseDirectory,
      });

      console.log("File created successfully");
      return {
        id: path,
        name: name,
        isSelectable: true,
        path: path,
      };
    } catch (error) {
      console.error("Failed to create file:", error);
      throw new Error("Create operation failed");
    }
  }
}
