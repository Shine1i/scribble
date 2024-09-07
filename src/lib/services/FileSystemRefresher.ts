import { BaseDirectory, DirEntry, readDir } from "@tauri-apps/plugin-fs";
import {FileSystemItem, IFileSystemRefresher} from "@/lib/interfaces/IFileInterfaces";
import {join} from "@tauri-apps/api/path";

export class FileSystemRefresher implements IFileSystemRefresher {
    async retrieveFileSystem(): Promise<FileSystemItem[]> {
        try {
            return this.processDirectory('Scribble', BaseDirectory.Document);
        } catch (error) {
            console.error("Failed to refresh file system:", error);
            throw new Error("Refresh operation failed");
        }
    }
    
    private async processDirectory(path: string, baseDir: BaseDirectory): Promise<FileSystemItem[]> {
        const entries = await readDir(path, { baseDir: baseDir });
        const items: FileSystemItem[] = [];
        
        for (const entry of entries) {
            const newItem: FileSystemItem = {
                id: await join(path, entry.name),
                name: entry.name,
                isSelectable: true,
                path:await join(path, entry.name)
            };
            
            if (entry.isDirectory) {
                newItem.children = await this.processDirectory(await join(path, entry.name), baseDir);
            }
            
            items.push(newItem);
        }
        
        return items;
    }
}