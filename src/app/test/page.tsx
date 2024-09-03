"use client"

import * as React from "react"

import { Workflow, Folder, Layout } from "lucide-react";
import { FileSystemTree} from "@/app/test/index";

export const data = [
    {
        id: "root",
        name: "My Notes",
        type: "folder",
        children: [
            {
                id: "work",
                name: "Work",
                type: "folder",
                children: [
                    {
                        id: "project-a",
                        name: "Project A",
                        type: "folder",
                        children: [
                            { id: "project-a-overview", name: "Project Overview.md", type: "file" },
                            { id: "project-a-meeting-notes", name: "Meeting Notes.md", type: "file" },
                        ]
                    },
                    {
                        id: "project-b",
                        name: "Project B",
                        type: "folder",
                        children: [
                            { id: "project-b-requirements", name: "Requirements.md", type: "file" },
                            { id: "project-b-timeline", name: "Timeline.md", type: "file" },
                        ]
                    },
                    { id: "work-todos", name: "To-Do List.md", type: "file" },
                ]
            },
            {
                id: "personal",
                name: "Personal",
                type: "folder",
                children: [
                    {
                        id: "journal",
                        name: "Journal",
                        type: "folder",
                        children: [
                            { id: "journal-2023", name: "2023.md", type: "file" },
                            { id: "journal-2024", name: "2024.md", type: "file" },
                        ]
                    },
                    {
                        id: "recipes",
                        name: "Recipes",
                        type: "folder",
                        children: [
                            { id: "recipe-pancakes", name: "Pancakes.md", type: "file" },
                            { id: "recipe-spaghetti", name: "Spaghetti Bolognese.md", type: "file" },
                        ]
                    },
                    { id: "bucket-list", name: "Bucket List.md", type: "file" },
                ]
            },
            {
                id: "ideas",
                name: "Ideas",
                type: "folder",
                children: [
                    { id: "app-ideas", name: "App Ideas.md", type: "file" },
                    { id: "business-ideas", name: "Business Ideas.md", type: "file" },
                ]
            },
            { id: "quick-notes", name: "Quick Notes.md", type: "file" },
            {
                id: "archived",
                name: "Archived",
                type: "folder",
                children: [
                    { id: "old-project", name: "Old Project.md", type: "file" },
                    { id: "archived-notes", name: "Archived Notes.md", type: "file" },
                ]
            },
        ]
    },
    {
        id: "shared-notes",
        name: "Shared Notes",
        type: "folder",
        children: [
            { id: "team-goals", name: "Team Goals.md", type: "file" },
            { id: "meeting-minutes", name: "Meeting Minutes.md", type: "file" },
        ]
    }
];

export default function IndexPage() {
    const [content, setContent] = React.useState("Admin Page")
    return (
      // <Shell className="gap-12 min-h-screen">
          <div className="flex min-h-full space-x-2">
              <FileSystemTree
                data={data}
                className="flex-shrink-0 w-[200px] h-[460px]  border-[1px]"
                onSelectChange={(item) => setContent(item?.name ?? "")}
                onCreateFile={(parentId) => console.log("Create file in:", parentId)}
                onCreateFolder={(parentId) => console.log("Create folder in:", parentId)}
                onDelete={(item) => console.log("Delete:", item)}
              />
              <div className="flex-1">{content}</div>
          </div>
      // </Shell>
    )
}
