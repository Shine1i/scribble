import {FileSystemItem} from "@/app/test";
import {BaseDirectory, DirEntry, readDir} from "@tauri-apps/plugin-fs";
import {join} from "@tauri-apps/api/path";
import {IFileSystemRefresher} from "@/lib/interfaces/IFileInterfaces";

export class FileSystemRefresher implements IFileSystemRefresher {
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