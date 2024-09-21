// FileRenamer.ts
import { BaseDirectory, rename } from "@tauri-apps/plugin-fs";
import { IFileRenamer } from "../types";

export class FileRenamer implements IFileRenamer {
  async renameFile(oldPath: string, newPath: string): Promise<void> {
    try {
      await rename(oldPath, newPath, {
        oldPathBaseDir: BaseDirectory.Document,
        newPathBaseDir: BaseDirectory.Document,
      });
      console.log("Successfully renamed file from", oldPath, "to", newPath);
    } catch (error) {
      console.error("Failed to rename file:", error);
      throw new Error("Failed to rename file");
    }
  }

  async renameDirectory(oldPath: string, newPath: string): Promise<void> {
    try {
      await rename(oldPath, newPath, {
        oldPathBaseDir: BaseDirectory.Document,
        newPathBaseDir: BaseDirectory.Document,
      });
      console.log(
        "Successfully renamed directory from",
        oldPath,
        "to",
        newPath,
      );
    } catch (error) {
      console.error("Failed to rename directory:", error);
      throw new Error("Failed to rename directory");
    }
  }
}
