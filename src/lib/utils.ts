import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { save, SaveDialogOptions } from "@tauri-apps/plugin-dialog";
import { toast } from "sonner";
import { Command } from "@tauri-apps/plugin-shell";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormatMap {
  [key: string]: string;
}

export async function exportNote(
  inputPath: string,
  noteName: string,
  outputFormat: string,
): Promise<string | null> {
  try {
    const formatMap: FormatMap = {
      md: "markdown",
      html: "html",
      docx: "docx",
      pdf: "pdf",
      txt: "plain",
    };

    const pandocFormat = formatMap[outputFormat] || outputFormat;
    const fileExtension = outputFormat;

    const saveOptions: SaveDialogOptions = {
      defaultPath: `${noteName}.${fileExtension}`,
      title: `Save ${noteName}.${fileExtension}`,
      filters: [
        {
          name: `${outputFormat.toUpperCase()} Files`,
          extensions: [fileExtension],
        },
      ],
    };

    const outputPath = await save(saveOptions);

    if (!outputPath) {
      toast.error("Export cancelled", {
        description: "User cancelled the export process",
      });
      return null;
    }

    toast.success("Output path selected", { description: outputPath });

    const finalOutputPath = outputPath.endsWith(`.${fileExtension}`)
      ? outputPath
      : `${outputPath}/${noteName}.${fileExtension}`;

    const pandocArgs = [
      inputPath,
      "-f",
      "html",
      "-t",
      pandocFormat,
      "-o",
      finalOutputPath,
      "--wrap=none",
    ];

    toast.loading("Executing Pandoc command...");
    const command = Command.sidecar("binaries/pandoc", pandocArgs);
    const output = await command.execute();

    toast.success("Export completed", {
      description: `File saved: ${finalOutputPath}`,
    });
    return finalOutputPath;
  } catch (error) {
    toast.error("Export failed", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
    throw error;
  }
}
