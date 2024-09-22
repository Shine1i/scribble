"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import { Button } from "@/components/tailwind/ui/button";
import { Input } from "@/components/tailwind/ui/input";
import { create } from "zustand";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  status: "loading" | "success" | "error";
  content: string;
  context?: {
    file: string;
    lines?: string;
  }[];
};

interface AIStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  editMessage: (message: Message) => void;
  getMessages: () => Message[];
}

const useAIMessages = create<AIStore>((set, get) => ({
  messages: [],
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

const useAiContainer = create<AIContainer>((set, get) => ({
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
}));

export default function AIChatComponent() {
  const { messages, addMessage, editMessage } = useAIMessages();
  const { setContainer, scrollToBottom } = useAiContainer();
  const [input, setInput] = useState("");

  const localContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (localContainer.current) setContainer(localContainer.current);
  }, [localContainer.current]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      status: "success",
      role: "user",
      content: input,
      id: crypto.randomUUID(),
    };
    addMessage(userMessage);
    setInput("");

    // Simulating AI response with context
    // In a real application, you would call your AI service here

    const messageId = crypto.randomUUID();
    addMessage({
      role: "assistant",
      status: "loading",
      content: "loading...",
      id: messageId,
    });
    scrollToBottom();

    // add 10 lines of random text to the message
    let text = "";
    const id = setInterval(() => {
      editMessage({
        id: messageId,
        role: "assistant",
        status: "success",
        content: (text += "\n\n # " + Math.random().toString(36).substring(2, 15)),
      });
    }, 100);

    setTimeout(() => {
      clearInterval(id);
      const aiMessage: Message = {
        id: messageId,
        role: "assistant",
        status: "success",
        content: (text += "\n\n" + "Here's what I found based on your notes:"),
        context: [
          { file: "note.md", lines: "45-50" },
          { file: "note.md", lines: "Current File" },
        ],
      };
      scrollToBottom();
      editMessage(aiMessage);
    }, 1000);
  };

  const { shouldAutoScroll } = useAutoScroll([messages]);

  return (
    <div className="h-full flex flex-col justify-end">
      <div
        ref={localContainer}
        className="flex-grow max-h-full overflow-y-auto"
      >
        <div className="flex flex-col p-4 h-full mt-auto">
          <div className="h-screen" />
          {messages.map((message, index) =>
            message.role === "user" ? (
              <UserMessage key={index} content={message.content} />
            ) : (
              <AgentMessage
                key={index}
                status={message.status}
                content={message.content}
                context={message.context}
              />
            ),
          )}
        </div>
      </div>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex space-x-2"
        >
          <Input
            type="text"
            placeholder="Ask about your notes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Send className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex items-start justify-end mb-4">
      <div className="flex items-start gap-2 flex-row-reverse">
        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
          <User className="w-6 h-6" />
        </div>
        <div className="max-w-xs text-right">
          <p className="text-sm">{content}</p>
        </div>
      </div>
    </div>
  );
}

interface AgentMessageProps {
  content: string;
  context?: {
    file: string;
    lines?: string;
  }[];
  status: "loading" | "success" | "error";
}

export function AgentMessage({ content, context, status }: AgentMessageProps) {
  return (
    <div className="flex items-start mb-4">
      <div className="flex items-start gap-2">
        <div className="p-2 rounded-lg bg-secondary">
          <Bot className="w-6 h-6" />
        </div>
        <div className="max-w-md prose prose-gruvbox">
          {status === "loading" ? (
            <LoadingContent />
          ) : (
            <>
              {context && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {context.map((ctx, ctxIndex) => (
                    <span
                      key={ctxIndex}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted"
                    >
                      {ctx.file} {ctx.lines && `(${ctx.lines})`}
                    </span>
                  ))}
                </div>
              )}
              <ReactMarkdown>{content}</ReactMarkdown>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingContent() {
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const lineVariants = {
    start: { scaleX: 0, opacity: 0 },
    end: { scaleX: 1, opacity: 1 },
  };

  const lineTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut",
  };

  return (
    <motion.div
      className="space-y-2"
      variants={containerVariants}
      initial="start"
      animate="end"
    >
      <motion.div className="flex space-x-2">
        <motion.div
          className="h-4 bg-muted rounded w-[75px]"
          variants={lineVariants}
          transition={lineTransition}
        />
        <motion.div
          className="h-4 bg-muted rounded w-[100px]"
          variants={lineVariants}
          transition={lineTransition}
        />
      </motion.div>
      <motion.div
        className="h-4 bg-muted rounded w-[225px]"
        variants={lineVariants}
        transition={lineTransition}
      />
      <motion.div
        className="h-4 bg-muted rounded w-[150px]"
        variants={lineVariants}
        transition={lineTransition}
      />
    </motion.div>
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
