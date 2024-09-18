"use client";
import * as React from "react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useFileSystemStore } from "@/hooks/use-file-system";
import { Button } from "@/components/tailwind/ui/button";
import Link from "next/link";
import { FileIcon, FileText, ImportIcon, PlusIcon } from "lucide-react";
import { FileSystemItem } from "@/lib/interfaces/IFileInterfaces";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/tailwind/ui/card";
import { Input } from "@/components/tailwind/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/tailwind/ui/dialog";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { listen, TauriEvent } from "@tauri-apps/api/event";
import { TimeFormat } from "@/components/tailwind/ui/timeFormat";

export default function Page() {
  return (
    <main className={"grid place-items-center w-full h-screen"}>
      <div className={"flex flex-col gap-2 max-w-screen-sm w-full"}>
        <Notes />
        <Button className={"w-full"}>
          <Link href={"/markdown-editor"}>Go to Markdown Editor</Link>
        </Button>
      </div>
    </main>
  );
}

function Notes() {
  const { getFileSystem, setCurrentFilePath, fileSystem } =
    useFileSystemStore();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const sortedFileSystem = useMemo(() => {
    const timeSorted = structuredClone(fileSystem).sort((a, b) => {
      if (a.lastModified && b.lastModified) {
        return b.lastModified.getTime() - a.lastModified.getTime();
      }
      return 0;
    });
    console.log(timeSorted);
    return search.trim()
      ? timeSorted.filter((item) => {
          return item.name.toLowerCase().includes(search.toLowerCase());
        })
      : timeSorted;
  }, [search, fileSystem]);

  useEffect(() => {
    getFileSystem().finally(() => setLoading(false));
  }, []);

  const navigateToSystemItem = (fileSystemItem: FileSystemItem) => {
    setCurrentFilePath(fileSystemItem.path);
    router.push("/test");
  };

  return (
    <div className={"flex flex-col gap-2 h-full"}>
      <div className={"flex flex-row gap-2"}>
        <Input
          className={"bg-card text-card-foreground"}
          value={search}
          placeholder="Search files..."
          onChange={(e) => setSearch(e.target.value)}
          type={"text"}
        />
        <CreateNote />
        <ImportNote />
      </div>
      <Card className={"flex flex-col min-w-[200px]"}>
        <CardHeader>
          <p className={"font-bold"}>Recent Files</p>
        </CardHeader>
        <CardContent>
          <div className={"max-h-[300px] overflow-y-auto"}>
            {loading && <p>Loading...</p>}
            {sortedFileSystem.length === 0 && !loading && (
              <p>No files found try creating one!</p>
            )}
            {sortedFileSystem &&
              sortedFileSystem.map((systemItem, index) => (
                <button
                  onClick={() => navigateToSystemItem(systemItem)}
                  className={
                    "flex flex-row justify-between p-2 hover:bg-primary/10 rounded w-full duration-200"
                  }
                  key={index}
                >
                  <span className={"flex flex-row gap-2"}>
                    <FileIcon />
                    {systemItem.name}
                  </span>
                  {systemItem.lastModified && (
                    <TimeFormat
                      date={systemItem.lastModified}
                      options={{
                        relative: true,
                        locale: "en-US",
                      }}
                    />
                  )}
                </button>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateNote() {
  const [newNoteName, setNewNoteName] = useState("");
  const { createFile } = useFileSystemStore();

  const [open, setOpen] = useState(false);

  const handleCreateNote = useCallback(async () => {
    const id = toast.loading("Creating Note...");
    try {
      await createFile({
        name: newNoteName,
      });
      toast.success("Note created", {
        id: id,
      });
      setOpen(false);
      setNewNoteName("");
    } catch (error) {
      toast.error("Failed to create note", {
        description: (error as Error)?.message,
        id: id,
      });
    }
  }, [newNoteName]);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className={"bg-card text-card-foreground"}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Input
            value={newNoteName}
            onChange={(e) => setNewNoteName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateNote();
              }
            }}
            type={"text"}
            placeholder={"Note name"}
          />
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
          <Button variant={"default"} onClick={handleCreateNote}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportNote() {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const unlistenFnPromise = listen("tauri://drag-drop", (event) => {
      if (event.event !== "tauri://drag-drop") return;

      const { payload } = event as DragDropEvent;

      payload.paths;

      console.log(event);
    });

    return () => {
      unlistenFnPromise.then((unlistenFn) => unlistenFn());
    };
  }, []);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        setFile(files[0]);
      }
    },
    [],
  );

  const handleFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target?.result as string;
    };
    reader.readAsText(file);
  }, []);

  useEffect(() => {
    if (file) {
      handleFile(file);
    }
  }, [file, handleFile]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className={"bg-card text-card-foreground"}>
          <ImportIcon className="w-4 h-4 mr-2" />
          Import Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Note</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-4 py-4">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Markdown or text files only
                </p>
              </div>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".md,.html,.htm,.tex,.docx,.odt,.epub,.textile,.rst,.adoc,.asc,.org,.mediawiki,.wiki,.muse,.opml,.dbk,.jats,.tei,.man,.md,.markdown,.gfm,.mmd,.json"
              />
            </label>
            {file && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Selected file: {file.name}
              </p>
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

interface Position {
  x: number;
  y: number;
}

interface DragDropPayload {
  paths: string[];
  position: Position;
}

interface DragDropEvent {
  event: "tauri://drag-drop";
  payload: DragDropPayload;
  id: number;
}
