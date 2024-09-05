// src/managers/FileManager.ts
import {IFileOpener, IFileSaver, IFileSystemInitializer, IFileSystemRefresher} from "@/lib/interfaces/IFileInterfaces";
import {FileSaver} from "@/lib/services/FileSaver";
import {FileSystemRefresher} from "@/lib/services/FileSystemRefresher";
import {FileOpener} from "@/lib/services/FileOpener";
import {FileSystemInitializer} from "@/lib/services/FileSystemInitializer";







class FileManager {
    constructor(
      private fileSaver: IFileSaver,
      private fileSystemRefresher: IFileSystemRefresher,
      private  fileSystemInitializer: IFileSystemInitializer,
      private fileOpener: IFileOpener
    ) {}
    
    async saveFile(filepath:string, content: any) {
        await this.fileSaver.saveFile(filepath, content);
    }
    
    async createFile(parentPath: string, fileName: string, content: any) {
        await this.fileCreator.createFile(parentPath, fileName, content);
        await this.fileSystemRefresher.retrieveFileSystem();
    }
    
    async retrieveFileSystem(){
         return await this.fileSystemRefresher.retrieveFileSystem();
    }
    async initializeFileSystem() {
        await this.fileSystemInitializer.initialize();
        await this.fileSystemRefresher.retrieveFileSystem();
    }
    async openFile(path: string) {
       return await this.fileOpener.openFile(path);
    }
}
const fileSaver = new FileSaver();
const fileSystemRefresher = new FileSystemRefresher();
const fileOpener = new FileOpener();
const fileSystemInitializer = new FileSystemInitializer();
export const fileManager = new FileManager(fileSaver, fileSystemRefresher,fileSystemInitializer,fileOpener);