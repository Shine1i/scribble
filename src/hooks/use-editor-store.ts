import type {EditorInstance, JSONContent} from "novel";
import {FileSystemItem} from "@/app/test";
import {create} from "zustand";

export interface EditorState {
    currentFilePath: string  | null;
    editorContent: JSONContent | null;
    saveStatus: string;
    charsCount: number | undefined;
    fileSystem: FileSystemItem[];
    editorInstance: EditorInstance | null;
    
    setCurrentFilePath: (path: string | null) => void;
    setEditorContent: (content: JSONContent | null) => void;
    setSaveStatus: (status: string) => void;
    setCharsCount: (count: number | undefined) => void;
    setFileSystem: (items: FileSystemItem[]) => void;
    setEditorInstance: (instance: EditorInstance | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    currentFilePath: null,
    editorContent: null,
    saveStatus: 'Saved',
    charsCount: undefined,
    fileSystem: [],
    editorInstance: null,
    setCurrentFilePath: (path) => set({ currentFilePath: path }),
    setEditorContent: (content) => set({ editorContent: content }),
    setSaveStatus: (status) => set({ saveStatus: status }),
    setCharsCount: (count) => set({ charsCount: count }),
    setFileSystem: (items) => set({ fileSystem: items }),
    setEditorInstance: (instance) => set({ editorInstance: instance })
}));