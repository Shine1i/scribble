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
  const id = toast.loading("Saving...", {
    description: `Saving ${noteName}.${outputFormat}`,
  });
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
      toast.error("Save cancelled", {
        description: `File not saved: ${noteName}.${fileExtension}`,
        id,
      });
      return null;
    }

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

    const command = Command.sidecar("binaries/pandoc", pandocArgs);
    const output = await command.execute();

    toast.success("Save Completed", {
      description: `File successfully converted and saved to: ${finalOutputPath}`,
      id,
    });
    return finalOutputPath;
  } catch (error) {
    toast.error("Save failed", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
      id,
    });
    throw error;
  }
}

export async function convertMarkdownFileToHtml(
  inputPath: string,
): Promise<string> {
  const id = toast.loading("Converting Markdown file to HTML...");
  try {
    const pandocArgs = [
      inputPath,
      "-f",
      "gfm+task_lists",
      "-t",
      "html",
      "--wrap=none",
      "-s", // Standalone HTML (includes <head> and <body>)
      "--metadata",
      "pagetitle=''", // Empty title to avoid default "Pandoc" title
    ];

    const command = Command.sidecar("binaries/pandoc", pandocArgs);
    const output = await command.execute();

    if (output.code !== 0) {
      throw new Error(`Pandoc error: ${output.stderr}`);
    }

    toast.success("Conversion completed", {
      description: "Markdown file successfully converted to HTML",
      id,
    });

    return output.stdout;
  } catch (error) {
    toast.error("Conversion failed", {
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
      id,
    });
    throw error;
  }
}
