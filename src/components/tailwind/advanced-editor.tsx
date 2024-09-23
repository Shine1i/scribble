"use client";
import { defaultEditorContent } from "@/lib/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
} from "novel";
import { handleCommandNavigation, ImageResizer } from "novel/extensions";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { MathSelector } from "./selectors/math-selector";
import { Separator } from "./ui/separator";

import { handleImageDrop, handleImagePaste } from "novel/plugins";
import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import hljs from "highlight.js";

import { useEditorStore } from "@/hooks/use-editor-store";
import { SaveStatus, useFileSystemStore } from "@/hooks/use-file-system";
import { convertMarkdownFileToHtml } from "@/lib/utils";
import { documentDir } from "@tauri-apps/api/path";
import {
  getHierarchicalIndexes,
  TableOfContents,
} from "@tiptap-pro/extension-table-of-contents";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { useSettings } from "@/hooks/use-settings";

const MarkdownEditor = () => {
  const { currentFilePath, saveCurrentFile, saveStatus, setSaveStatus } =
    useFileSystemStore();

  const {
    editorContent,
    charsCount,
    editorInstance,
    setEditorInstance,
    setEditorContent,
    setCharsCount,
    setTocItems,
  } = useEditorStore();
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const extensions = [
    ...defaultExtensions,
    slashCommand,
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      onUpdate(content) {
        setTocItems(content);
      },
    }),
  ];
  const { settings } = useSettings();

  const convertMarkdownToHtml = async (path: string) => {
    if (!editorInstance) return;

    const html = await convertMarkdownFileToHtml(
      (await documentDir()) + "/" + path,
    );

    editorInstance.commands.setContent(html);
  };

  useEffect(() => {
    console.log("currentFilePath", currentFilePath);
    console.log("editorInstance", editorInstance);
    if (currentFilePath && editorInstance) {
      convertMarkdownToHtml(currentFilePath);
    }
  }, [currentFilePath, editorInstance]);

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      setCharsCount(editor.storage.characterCount.words());
      setEditorInstance(editor);
      setSaveStatus(SaveStatus.Unsaved);
      if (editor.getText().length > 0) {
        await saveCurrentFile();
      }
    },
    500,
  );

  const focusEditor = () => {
    editorInstance?.commands.focus();
  };

  useEffect(() => {
    // command control + e
    (async () => {
      await register("CommandOrControl+e", (event) => {
        if (event.state === "Pressed") {
          console.log("Shortcut triggered");
        }
        console.log("command control + e");
        focusEditor();
      });
    })();
  }, []);

  useEffect(() => {
    if (saveStatus === "Unsaved" && editorInstance) {
      const timer = setTimeout(() => saveCurrentFile(), settings.debounceRate);
      return () => clearTimeout(timer);
    }
  }, [saveStatus, editorContent, editorInstance, saveCurrentFile]);

  // do this so we can keep immediatelyRender=true and not have hydration errors
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  return (
    <div className="relative w-full h-full cursor-text" onClick={focusEditor}>
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
        <div className="rounded-lg bg-card px-2 py-1 text-sm text-muted-foreground">
          {saveStatus}
        </div>
        <div
          className={
            charsCount
              ? "rounded-lg bg-[var(--popover)] px-2 py-1 text-sm text-muted-foreground"
              : "hidden"
          }
        >
          {charsCount} Words
        </div>
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={editorContent}
          extensions={extensions}
          immediatelyRender={true}
          className="relative min-h-[500px] w-full  grow rounded-lg h-full"
          editorProps={{
            //@ts-ignore
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-gruvbox prose-a:text-border prose-pre:border-l-4 prose-pre:rounded-sm  prose-pre:bg-muted prose-h1:text-[var(--rose-prose-h1)] prose-h2:text-[var(--rose-prose-h2)] prose-h3:text-[var(--rose-prose-h3)] prose-h4:text-[var(--rose-prose-h4)] prose-h5:text-[var(--rose-prose-h5)] prose-h6:text-[var(--rose-prose-h6)] prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus(SaveStatus.Unsaved);
          }}
          onBeforeCreate={({ editor }) => {
            setEditorInstance(editor);
          }}
          onCreate={({ editor }) => {
            setEditorInstance(editor);
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-accent px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command!(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default MarkdownEditor;
