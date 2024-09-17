// src/managers/FileManager.ts
import { FileSaver } from "@/lib/services/FileSaver";
import { FileSystemRefresher } from "@/lib/services/FileSystemRefresher";
import { FileOpener } from "@/lib/services/FileOpener";
import { FileSystemInitializer } from "@/lib/services/FileSystemInitializer";
import { FileDeleter } from "@/lib/services/FileDeleter";
import { FileRenamer } from "@/lib/services/FileRenamer";
import { BaseDirectory } from "@tauri-apps/plugin-fs";

class FileManager {
  constructor(
    private fileSaver: FileSaver,
    private fileSystemRefresher: FileSystemRefresher,
    private fileSystemInitializer: FileSystemInitializer,
    private fileOpener: FileOpener,
    private fileDeleter: FileDeleter,
    private fileRenamer: FileRenamer,
  ) {}

  async saveFile(filepath: string, content: any) {
    await this.fileSaver.saveFile(filepath, content);
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
  ) {
    return await this.fileSaver.createFile(baseDirectory, {
      name,
      payload,
    });
  }

  async retrieveFileSystem() {
    return await this.fileSystemRefresher.retrieveFileSystem();
  }

  async initializeFileSystem() {
    await this.fileSystemInitializer.initialize();
    await this.fileSystemRefresher.retrieveFileSystem();
  }

  async getFileContent(path: string) {
    return await this.fileOpener.openFile(path);
  }

  async deleteFile(filePath: string) {
    return await this.fileDeleter.deleteFile(filePath);
  }

  async deleteDirectory(path: string, recursive: boolean) {
    return await this.fileDeleter.deleteDirectory(path, recursive);
  }

  async renameFile(oldPath: string, newPath: string) {
    return await this.fileRenamer.renameFile(oldPath, newPath);
  }

  async renameDirectory(oldPath: string, newPath: string) {
    return await this.fileRenamer.renameDirectory(oldPath, newPath);
  }
}

const fileSaver = new FileSaver();
const fileSystemRefresher = new FileSystemRefresher();
const fileOpener = new FileOpener();
const fileSystemInitializer = new FileSystemInitializer();
const fileDeleter = new FileDeleter();
const fileRenamer = new FileRenamer();
export const fileManager = new FileManager(
  fileSaver,
  fileSystemRefresher,
  fileSystemInitializer,
  fileOpener,
  fileDeleter,
  fileRenamer,
);
