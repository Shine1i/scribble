import { User } from "lucide-react";
import { Message } from "../aiDashboard";
import { ContextBadges } from "./context";

interface UserMessageProps {
    content: string;
  }
  
  export function UserMessage({ message }: { message: Message }) {
    return (
      <div className="flex items-start justify-end mb-4">
        <div className="flex items-start gap-2 flex-row-reverse">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <User className="w-6 h-6" />
          </div>
          <div className="max-w-xs text-right">
            {message.context && (
              <div className="flex flex-wrap gap-1 mb-2">
                <ContextBadges context={message.context} />
              </div>
            )}
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }