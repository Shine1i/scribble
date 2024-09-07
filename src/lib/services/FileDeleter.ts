import {BaseDirectory, readTextFile, remove} from "@tauri-apps/plugin-fs";
import {IFileDeleter} from "../interfaces/IFileInterfaces";

export class FileDeleter implements IFileDeleter {
    async deleteFile(path: string): Promise<void> {
        try {
            await remove(path, {
                baseDir: BaseDirectory.Document,
            });
        } catch (error) {
            throw new Error("Failed to delete file");
        }
    }
    
    async deleteDirectory(path: string, recursive: boolean = false): Promise<void> {
        try {
            await remove(path, {
                baseDir: BaseDirectory.Document,
                recursive: recursive,
            });
        } catch (error) {
            throw new Error("Failed to delete directory");
        }
    }
}