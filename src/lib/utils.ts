import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {BaseDirectory, readTextFile} from "@tauri-apps/plugin-fs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
