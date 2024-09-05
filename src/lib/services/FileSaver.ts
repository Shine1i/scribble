import {BaseDirectory, writeTextFile} from "@tauri-apps/plugin-fs";
import {IFileSaver} from "@/lib/interfaces/IFileInterfaces";

export class FileSaver implements IFileSaver {
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