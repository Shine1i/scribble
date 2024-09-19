import { useFileSystemStore } from "@/hooks/use-file-system";
import { FileSystemItem } from "@/lib/interfaces/IFileInterfaces";
import { Button } from "@/components/tailwind/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/tailwind/ui/dialog";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/tailwind/ui/input";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { DialogHeader, DialogFooter } from "./tailwind/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";

export function CreateNoteDialog({ children, ...props }: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <CreateNoteContent />
      </DialogContent>
    </Dialog>
  );
}

export function CreateNoteContent({ onSubmit }: { onSubmit?: (name: FileSystemItem) => void }) {
  const [newNoteName, setNewNoteName] = useState("");
  const { createFile } = useFileSystemStore();

  const handleCreateNote = useCallback(async () => {
    const id = toast.loading("Creating note...");
    if (newNoteName.trim() === "") {
      toast.error("Note name cannot be empty", { id });
      return;
    }
    try {
      const newNote = await createFile({
        name: newNoteName,
      });

      setNewNoteName("");
      toast.success("Note created", { id });
      onSubmit?.(newNote);
    } catch (error) {
      toast.error("Failed to create note", { id });
    }
  }, [newNoteName, createFile]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create New File</DialogTitle>
      </DialogHeader>
      <Input
        value={newNoteName}
        onChange={(e) => setNewNoteName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleCreateNote();
          }
        }}
        type="text"
        placeholder="Note name"
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button variant="default" onClick={handleCreateNote}>
          Create
        </Button>
      </DialogFooter>
    </>
  );
}

// You can keep the original CreateNote component for backwards compatibility
export function CreateNote({
  children,
  onSubmit,
}: {
  children?: React.ReactNode;
  onSubmit?: (name: FileSystemItem) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <CreateNoteDialog open={open} onOpenChange={(open) => setOpen(open)}>
      {children ? (
        children
      ) : (
        <Button variant="outline" className="bg-card text-card-foreground">
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Note
        </Button>
      )}
    </CreateNoteDialog>
  );
}
