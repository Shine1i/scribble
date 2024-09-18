import React from "react";

import {
  PlusCircle,
  Search,
  FileText,
  Folder,
  Clock,
  Star,
  LayoutTemplate,
} from "lucide-react";
import { ScrollArea } from "@/components/tailwind/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tailwind/ui/tabs";
import { Button } from "@/components/tailwind/ui/button";
import { Input } from "@/components/tailwind/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/tailwind/ui/card";
import { Badge } from "@/components/tailwind/ui/badge";

export default function Dashboard() {
  const recentNotes = [
    {
      id: 1,
      title: "Project Kickoff Meeting",
      date: "2023-06-15",
      time: "14:30",
      content: "Discussed project goals and timeline...",
      tags: ["Work", "Meeting"],
    },
    {
      id: 2,
      title: "Recipe: Chocolate Chip Cookies",
      date: "2023-06-14",
      time: "20:15",
      content: "Ingredients: 2 1/4 cups all-purpose flour...",
      tags: ["Personal", "Recipe"],
    },
    {
      id: 3,
      title: "Book Notes: The Alchemist",
      date: "2023-06-13",
      time: "10:45",
      content: "Key themes: Personal Legend, following dreams...",
      tags: ["Books", "Notes"],
    },
  ];

  const templates = [
    { id: 1, name: "Meeting Notes", icon: <FileText className="h-6 w-6" /> },
    { id: 2, name: "Weekly Planner", icon: <Clock className="h-6 w-6" /> },
    { id: 3, name: "Project Tracker", icon: <Star className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, User!
        </h1>
        <p className="text-gray-600">Let's organize your thoughts and ideas.</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input className="pl-10 w-64" placeholder="Search notes..." />
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Recent Notes
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>
                Start with a pre-defined structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  "Meeting Minutes",
                  "Project Plan",
                  "Daily Journal",
                  "Book Review",
                  "Recipe",
                  "Travel Planner",
                ].map((template, index) => (
                  <Button
                    variant="outline"
                    key={index}
                    className="h-20 flex flex-col items-center justify-center"
                  >
                    <LayoutTemplate className="h-6 w-6 mb-1" />
                    <span className="text-sm">{template}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="templates">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="folders">Folders</TabsTrigger>
                </TabsList>
                <TabsContent value="templates">
                  <ScrollArea className="h-[200px]">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        variant="ghost"
                        className="w-full justify-start mb-2"
                      >
                        {template.icon}
                        <span className="ml-2">{template.name}</span>
                      </Button>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="folders">
                  <ScrollArea className="h-[200px]">
                    <Button
                      variant="ghost"
                      className="w-full justify-start mb-2"
                    >
                      <Folder className="h-6 w-6 mr-2" />
                      Personal
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start mb-2"
                    >
                      <Folder className="h-6 w-6 mr-2" />
                      Work
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start mb-2"
                    >
                      <Folder className="h-6 w-6 mr-2" />
                      Projects
                    </Button>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
