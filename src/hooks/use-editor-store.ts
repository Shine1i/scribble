import type { EditorInstance, JSONContent } from "novel";
import { create } from "zustand";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";

export interface ToCItem {
  id: string;
  level: number;
  text: string;
  itemIndex: string;
  pos: number;
}

export interface EditorState {
  editorContent: JSONContent | undefined;
  charsCount: number | undefined;
  editorInstance: EditorInstance | null;
  tocItems: TableOfContentData;

  setEditorContent: (content: JSONContent | void) => void;
  setCharsCount: (count: number | undefined) => void;
  setEditorInstance: (instance: EditorInstance | null) => void;
  setTocItems: (items: TableOfContentData) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  editorContent: undefined,
  charsCount: undefined,
  editorInstance: null,
  tocItems: [],
  setEditorContent: (content) => set({ editorContent: content || undefined }),
  setCharsCount: (count) => set({ charsCount: count }),
  setEditorInstance: (instance) => set({ editorInstance: instance }),
  setTocItems: (items) => set({ tocItems: items }),
}));
