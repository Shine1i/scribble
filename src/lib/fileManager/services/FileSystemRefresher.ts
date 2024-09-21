import { BaseDirectory, readDir, stat } from "@tauri-apps/plugin-fs";
import {
  FileSystemItem,
  IFileSystemRefresher,
} from "@/lib/interfaces/IFileInterfaces";
import { join } from "@tauri-apps/api/path";
import { convertFilenameToContentType } from "../../convertTypes";

export class FileSystemRefresher implements IFileSystemRefresher {
  async retrieveFileSystem(
    directory?: BaseDirectory,
  ): Promise<FileSystemItem[]> {
    try {
      return this.processDirectory(
        "Scribble",
        directory || BaseDirectory.Document,
      );
    } catch (error) {
      console.error("Failed to refresh file system:", error);
      throw new Error("Refresh operation failed");
    }
  }

  private async processDirectory(
    path: string,
    baseDir: BaseDirectory,
  ): Promise<FileSystemItem[]> {
    const entries = await readDir(path, { baseDir: baseDir });
    const items: FileSystemItem[] = [];

    for (const entry of entries) {
      const fullPath = await join(path, entry.name);
      const fileStats = await stat(fullPath, { baseDir });

      const newItem: FileSystemItem = {
        id: fullPath,
        name: entry.name,
        isSelectable: true,
        path: fullPath,
        lastModified: fileStats.mtime ? new Date(fileStats.mtime) : undefined,
        contentType: convertFilenameToContentType(entry.name),
      }

      if (entry.isDirectory) {
        newItem.children = await this.processDirectory(fullPath, baseDir);
      }

      items.push(newItem);
    }

    return items;
  }
}
