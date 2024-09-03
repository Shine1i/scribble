import {path} from "@tauri-apps/api";
import {FileSystemItem} from "@/app/test";
import {documentDir, join} from "@tauri-apps/api/path";
import {BaseDirectory, DirEntry, exists, mkdir, readDir, readTextFile, writeTextFile} from "@tauri-apps/plugin-fs";
import {useEditorStore} from "@/hooks/use-editor-store";

interface IFileSaver {
    saveFile(filePath:string, content: any): Promise<void>;
}

interface IFileCreator {
    createFile(parentPath: string, fileName: string, content: any): Promise<void>;
}

interface IFileSystemRefresher {
    retrieveFileSystem(): Promise<FileSystemItem[]> ;
}
 interface IFileSystemInitializer {
    initialize(): Promise<void>;
}
interface IFileOpener{
    openFile(path: string): Promise<string>;
}

class FileOpener implements IFileOpener {
    async openFile(path: string): Promise<string> {
        try {
            const content = await readTextFile(path, {
                baseDir: BaseDirectory.Document,
            });
            return content
        } catch (error) {
            console.error("Failed to open file:", error);
        }
        return "Failed to open file"
    }
}
class FileSystemInitializer implements IFileSystemInitializer {
    async initialize(): Promise<void> {
        const directory = await join(await documentDir(), "Scribble");
        
        const directoryExists = await exists('Scribble', {
            baseDir: BaseDirectory.Document,
        });
        
        if (!directoryExists) {
            console.log("Directory does not exist, creating...");
            await mkdir(directory, { baseDir: BaseDirectory.Document });
        } else {
            try {
                await readDir(directory, { baseDir: BaseDirectory.Document });
            } catch (error) {
                console.log("Error reading directory:", error);
            }
        }
    }
}
class FileSystemRefresher implements IFileSystemRefresher {
    async retrieveFileSystem():  Promise<FileSystemItem[]>  {
        try {
            const entries = await readDir('Scribble', { baseDir: BaseDirectory.Document });
             return await this.processEntriesRecursively('Scribble', entries);
        } catch (error) {
            console.error("Failed to refresh file system:", error);
            throw new Error("Refresh operation failed");
        }
    }
    
    private async processEntriesRecursively(parent: string, entries: DirEntry[]): Promise<FileSystemItem[]> {
        const fileSystemItems: FileSystemItem[] = [];
        for (const entry of entries) {
            const fullPath = await join(parent, entry.name ?? '');
            const newItem: FileSystemItem = {
                id: fileSystemItems.length.toFixed(),
                name: entry.name ?? '',
                type: entry.isDirectory ? 'folder' : 'file',
                path: fullPath,
                children: entry.isDirectory ? [] : undefined
            };
            
            if (entry.isDirectory) {
                const dir = await join(parent, entry.name);
                newItem.children = await this.processEntriesRecursively(dir, await readDir(dir, { baseDir: BaseDirectory.Document }));
            }
            
            fileSystemItems.push(newItem);
        }
        
        return fileSystemItems;
    }
}
class FileSaver implements IFileSaver {
    async saveFile(filePath:string, content: any): Promise<void> {
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
}
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