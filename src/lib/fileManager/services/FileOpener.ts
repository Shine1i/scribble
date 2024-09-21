import { BaseDirectory, readTextFile } from "@tauri-apps/plugin-fs";
import { IFileOpener } from "../types";

export class FileOpener implements IFileOpener {
  async openFile(path: string): Promise<string> {
    try {
      const content = await readTextFile(path, {
        baseDir: BaseDirectory.Document,
      });
      return content;
    } catch (error) {
      console.error("Failed to open file:", error);
    }
    return "Failed to open file";
  }
}
