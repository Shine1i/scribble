export interface IFileSaver {
  saveFile(filePath: string, content: any): Promise<void>;
}

export interface IFileDeleter {
  deleteFile(filePath: string): Promise<void>;

  deleteDirectory(path: string, recursive: boolean): Promise<void>;
}

export interface IFileCreator {
  createFile(parentPath: string, fileName: string, content: any): Promise<void>;
}

export interface IFileSystemRefresher {
  retrieveFileSystem(): Promise<FileSystemItem[]>;
}

export interface IFileSystemInitializer {
  initialize(): Promise<void>;
}

export interface IFileOpener {
  openFile(path: string): Promise<string>;
}

export interface IFileRenamer {
  renameFile(oldPath: string, newPath: string): Promise<void>;

  renameDirectory(oldPath: string, newPath: string): Promise<void>;
}

export interface FileSystemItem {
  id: string;
  name: string;
  isSelectable: boolean;
  path: string;
  children?: FileSystemItem[];
  lastModified?: Date;
  contentType?: string;
}