"use client";
import * as React from "react";
import { useFileSystemStore } from "@/hooks/use-file-system";
import { Button } from "@/components/tailwind/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileIcon, ImportIcon, PlusIcon } from "lucide-react";
import { FileSystemItem } from "@/lib/interfaces/IFileInterfaces";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/tailwind/ui/card";
import { Input } from "@/components/tailwind/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/tailwind/ui/dialog";
import { useEditorStore } from "@/hooks/use-editor-store";

export default function Page() {
  return (
    <main
      className={"flex flex-col items-center justify-center w-full h-screen"}
    >
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
  const { getFileSystem, setCurrentFilePath } = useFileSystemStore();
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  const {
    data: fileSystem,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fileSystem", search],
    queryFn: async () => {
      const fileSystem = await getFileSystem();

      return search.trim()
        ? fileSystem.filter((item) => {
            return item.name.toLowerCase().includes(search.toLowerCase());
          })
        : fileSystem;
    },
    refetchOnWindowFocus: false,
  });

  const navigateToSystemItem = (fileSystemItem: FileSystemItem) => {
    setCurrentFilePath(fileSystemItem.path);
    router.push("/markdown-editor");
  };

  if (isError) return <div>Error</div>;

  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"flex flex-row gap-2"}>
        <Input
          className={"bg-card text-card-foreground"}
          value={search}
          placeholder="Search notes..."
          onChange={(e) => setSearch(e.target.value)}
          type={"text"}
        />
        <CreateNote />
        <ImportNote />
      </div>
      <Card className={"flex flex-col min-w-[200px]"}>
        <CardHeader>
          <p className={"font-bold"}>Recent Notes</p>
        </CardHeader>
        <CardContent>
          <div className={"max-h-[500px] overflow-y-auto"}>
            {isLoading && <p>Loading...</p>}
            {fileSystem &&
              fileSystem.map((systemItem, index) => (
                <button
                  onClick={() => navigateToSystemItem(systemItem)}
                  className={
                    "flex flex-row justify-between p-2 hover:bg-primary/10 rounded w-full duration-200"
                  }
                  key={index}
                >
                  <FileIcon />
                  {systemItem.name}
                </button>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateNote() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={"outline"}
          className={"w-full bg-card text-card-foreground"}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <p>Create Note</p>
      </DialogContent>
    </Dialog>
  );
}

function ImportNote() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          variant={"outline"}
          className={"w-full bg-card text-card-foreground"}
        >
          <ImportIcon className="w-4 h-4 mr-2" />
          Import Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <p>Import Note</p>
      </DialogContent>
    </Dialog>
  );
}
