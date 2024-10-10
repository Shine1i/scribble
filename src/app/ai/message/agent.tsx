import { Bot, File, FileText } from "lucide-react";
import { BaseMessage, Message } from "../aiDashboard";
import { LoadingContent } from "./loading";
import ReactMarkdown from "react-markdown";
import { ContextBadges } from "./context";

export function AgentMessage({ message }: { message: Message }) {
  return (
    <div className="flex items-start mb-4">
      <div className="flex items-start gap-2">
        <div className="p-2 rounded-lg bg-secondary">
          <Bot className="w-6 h-6" />
        </div>
        <div className="max-w-md prose prose-gruvbox">
          {message.status === "loading" ? (
            <LoadingContent />
          ) : (
            <>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
