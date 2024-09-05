import {documentDir, join} from "@tauri-apps/api/path";
import {BaseDirectory, exists, mkdir, readDir} from "@tauri-apps/plugin-fs";
import {IFileSystemInitializer} from "@/lib/interfaces/IFileInterfaces";

export class FileSystemInitializer implements IFileSystemInitializer {
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