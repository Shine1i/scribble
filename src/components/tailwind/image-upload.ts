import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";
import { writeText, readText } from "@tauri-apps/plugin-clipboard-manager";

const handleLocalImage = async (file: File): Promise<string> => {
  try {
    // Convert File to base64
    const reader = new FileReader();
    const base64String = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    await writeText(base64String);

    const clipboardContent = await readText();
    console.log(clipboardContent, base64String, "test");
    if (clipboardContent !== base64String) {
      throw new Error("Failed to write image to clipboard");
    }

    const image = new Image();
    image.src = base64String;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    return base64String;
  } catch (error) {
    console.error("Error handling local image:", error);
    throw new Error("Error handling image. Please try again.");
  }
};

const onUpload = (file: File) => {
  return new Promise((resolve, reject) => {
    toast.promise(handleLocalImage(file), {
      loading: "Processing image...",
      success: "Image processed successfully.",
      error: (e) => {
        reject(e);
        return e.message;
      },
    });
  });
};

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    console.log(file, "file");
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
