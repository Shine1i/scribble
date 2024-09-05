import {FileSystemItem} from "@/app/test";

export interface IFileSaver {
    saveFile(filePath:string, content: any): Promise<void>;
}

export interface IFileCreator {
    createFile(parentPath: string, fileName: string, content: any): Promise<void>;
}

export interface IFileSystemRefresher {
    retrieveFileSystem(): Promise<FileSystemItem[]> ;
}
export interface IFileSystemInitializer {
    initialize(): Promise<void>;
}
export interface IFileOpener{
    openFile(path: string): Promise<string>;
}