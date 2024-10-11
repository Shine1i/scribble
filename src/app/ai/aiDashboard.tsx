"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Bot, FileText, Plus, Send, User, X } from "lucide-react";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Button } from "@/components/tailwind/ui/button";
import { Input } from "@/components/tailwind/ui/input";
import { create } from "zustand";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Label } from "@/components/tailwind/ui/label";
import { listen, TauriEvent } from "@tauri-apps/api/event";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { Slider } from "@/components/tailwind/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/tailwind/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/tailwind/ui/dialog";
import { PDFImport } from "./imports/pdf";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/tailwind/ui/popover";
import { File } from "lucide-react";
import { Badge } from "@/components/tailwind/ui/badge";
import { RenderMessages } from "./message";
import { ContextBadges } from "./message/context";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/tailwind/ui/command";

export interface MessageContext {
  id: string;
  contentType: string;
  shortDescription: string;
  data: string;
}

export interface BaseMessage {
  content: string;
  context?: MessageContext[];
}

export type Message = BaseMessage & {
  id: string;
  role: "user" | "assistant";
  status: "loading" | "success" | "error";
};

export interface AIStore {
  messages: Message[];
  inputMessage: BaseMessage;
  setInputMessage: (message: Partial<BaseMessage>) => void;
  addInputMessageContext: (context: MessageContext) => void;
  removeInputMessageContext: (id: string) => void;
  addMessage: (message: Message) => void;
  editMessage: (message: Message) => void;
  getMessages: () => Message[];
}

export const useAIMessages = create<AIStore>((set, get) => ({
  messages: [],
  inputMessage: {
    content: "",
    context: [],
  },
  setInputMessage: (message: Partial<BaseMessage>) =>
    set((state) => ({ inputMessage: { ...state.inputMessage, ...message } })),
  addInputMessageContext: (context: MessageContext) =>
    set((state) => ({
      inputMessage: {
        ...state.inputMessage,
        context: [...(state.inputMessage.context || []), context],
      },
    })),
  removeInputMessageContext: (id: string) =>
    set((state) => ({
      inputMessage: {
        ...state.inputMessage,
        context: state.inputMessage.context?.filter((ctx) => ctx.id !== id),
      },
    })),
  addMessage: (message: Message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  editMessage: (message: Message) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === message.id ? message : msg,
      ),
    })),
  getMessages: () => get().messages,
}));

interface AIContainer {
  container: HTMLDivElement | null;
  setContainer: (container: HTMLDivElement) => void;
  scrollToBottom: () => void;
}

export const useAiContainer = create<AIContainer>((set, get) => ({
  container: null,
  setContainer: (container: HTMLDivElement) => set({ container }),
  scrollToBottom: () => {
    const container = get().container;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "instant",
      });
    }
  },
  message: null,
}));

export default function AIChatComponent() {
  const { messages, addMessage, editMessage, inputMessage, setInputMessage } =
    useAIMessages();
  const { setContainer, scrollToBottom } = useAiContainer();

  const localContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (localContainer.current) setContainer(localContainer.current);
  }, [localContainer.current]);

  const sendMessage = async () => {
    if (!inputMessage.content.trim()) return;

    const currentContext = structuredClone(inputMessage.context);

    const userMessage: Message = {
      status: "success",
      role: "user",
      id: crypto.randomUUID(),
      ...inputMessage,
    };
    addMessage(userMessage);
    setInputMessage({
      content: "",
      context: [],
    });

    const messageId = crypto.randomUUID();
    addMessage({
      role: "assistant",
      status: "loading",
      content: "loading...",
      id: messageId,
    });
    scrollToBottom();

    let text = "";
    const id = setInterval(() => {
      editMessage({
        id: messageId,
        role: "assistant",
        status: "success",
        content: (text +=
          "\n\n # " + Math.random().toString(36).substring(2, 15)),
      });
    }, 100);

    setTimeout(() => {
      clearInterval(id);
      const aiMessage: Message = {
        id: messageId,
        role: "assistant",
        status: "success",
        content: (text += "\n\n" + "Here's what I found based on your notes:"),
        context: currentContext,
      };
      scrollToBottom();
      editMessage(aiMessage);
    }, 1000);
  };

  const { shouldAutoScroll } = useAutoScroll([messages]);

  const [dialog, setDialog] = useState<"pdf" | null>(null);

  return (
    <div className="h-full flex flex-col justify-end">
      <div
        ref={localContainer}
        className="flex-grow max-h-full overflow-y-auto"
      >
        <div className="flex flex-col p-4 h-full mt-auto">
          <div className="h-screen" />
          <RenderMessages messages={messages} />
        </div>
      </div>
      <div className="p-4 border-t flex flex-col gap-2">
        {/* Current Context */}
        <div>
          {inputMessage.context && (
            <ContextBadges context={inputMessage.context || []} removable />
          )}
        </div>
        <div >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex space-x-2"
          >
            <Dialog
              open={dialog !== null}
              onOpenChange={(open) => {
                if (!open) setDialog(null);
              }}
            >
              <Popover>
                <PopoverTrigger>
                  <Button size={"icon"}>
                    <Plus className="w-4 h-4" />
                    <span className="sr-only">Add</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Command>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                      <CommandItem
                        onSelect={() => {
                          setDialog("pdf");
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Import PDF</span>
                      </CommandItem>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <DialogContent>
                {dialog === "pdf" && (
                  <PDFImport onClose={() => setDialog(null)} />
                )}
              </DialogContent>
            </Dialog>
            <Input
              type="text"
              placeholder="Ask about your notes or PDF..."
              value={inputMessage.content}
              onChange={(e) => setInputMessage({ content: e.target.value })}
              className="flex-grow"
            />
            <Button type="submit">
              <Send className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function useAutoScroll(dependencies: any[] = []) {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const { container, setContainer, scrollToBottom } = useAiContainer();
  const prevHeightRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      setShouldAutoScroll(isAtBottom);
    }
  }, [container]);

  useEffect(() => {
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === container) {
          const newHeight = entry.contentRect.height;
          if (newHeight > prevHeightRef.current && shouldAutoScroll) {
            scrollToBottom();
          }
          prevHeightRef.current = newHeight;
        }
      }
    });

    resizeObserver.observe(container);
    container.addEventListener("scroll", handleScroll);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("scroll", handleScroll);
    };
  }, [container, scrollToBottom, handleScroll, shouldAutoScroll]);

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [...dependencies]);

  return { setContainer, shouldAutoScroll };
}
