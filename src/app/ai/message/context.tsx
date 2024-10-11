import { Badge } from "@/components/tailwind/ui/badge";
import { MessageContext, useAIMessages } from "../aiDashboard";
import { File, FileText, X } from "lucide-react";

export const ContextBadge = ({context, removable}: {context: MessageContext, removable?: boolean}) => {
  const { removeInputMessageContext } = useAIMessages();
  return (
    <Badge className="px-2 py-0.5 text-xs" key={context.data}>
      {context.contentType === "pdf" ? <File className="w-3 h-3"/> : <FileText className="w-3 h-3"/>}
      <span className="ml-1">
        {context.shortDescription}
      </span>
      {removable && (
        <button onClick={() => {
          removeInputMessageContext(context.id);
        }}>
          <X className="w-3 h-3 ml-1" />
        </button>
      )}
    </Badge>
  );
};

export const ContextBadges = ({context, removable}: {context: MessageContext[], removable?: boolean}) => {
    return (
        <div>
            {context.map((ctx, ctxIndex) => <ContextBadge key={ctxIndex} context={ctx} removable={removable} />)}
        </div>
    )
}
