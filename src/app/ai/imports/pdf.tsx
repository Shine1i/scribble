import { useAIMessages } from "../aiDashboard";
import { useEffect, useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/tailwind/ui/card";
import { Label } from "@/components/tailwind/ui/label";
import { Button } from "@/components/tailwind/ui/button";
import { Input } from "@/components/tailwind/ui/input";
import { Textarea } from "@headlessui/react";
import { Slider } from "@/components/tailwind/ui/slider";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { listen, TauriEvent } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { DragDropEvent } from "@/app/page";
import { readFile } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { normalize } from "path";

export const PDFImport = ({ onClose }: { onClose: () => void }) => {
  const { addInputMessageContext } = useAIMessages();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState<{ start: number; end: number }>({
    start: 1,
    end: 1,
  });
  const [maxPage, setMaxPage] = useState<number>(1);
  const [base64PDF, setBase64PDF] = useState<string>("");
  const [pageRanges, setPageRanges] = useState<string>("");
  const [parsedRanges, setParsedRanges] = useState<number[]>([]);

  const handleSubmit = () => {
    if (!base64PDF) return;

    addInputMessageContext({
      id: crypto.randomUUID(),
      contentType: "pdf",
      shortDescription: `${selectedFile?.name ? selectedFile.name : "PDF"} ${
        pageRange.start
      }-${pageRange.end}`,
      data: base64PDF,
    });

    onClose();
  };

  const handlePageRangesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageRanges(e.target.value);
  };

  const parsePageRanges = (input: string): number[] => {
    const ranges = input.split(",").map((range) => range.trim());
    const pages: number[] = [];

    ranges.forEach((range) => {
      if (range.includes("-")) {
        const [start, end] = range.split("-").map(Number);
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      } else {
        pages.push(Number(range));
      }
    });

    return Array.from(new Set(pages)).sort((a, b) => a - b);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();
        setPageRange({ start: 1, end: totalPages });
        setPageRanges(`1-${totalPages}`);
        setMaxPage(totalPages);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const processPDF = async () => {
    if (!selectedFile) return;

    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const totalPages = pdfDoc.getPageCount();
    setMaxPage(totalPages);

    let validPages = parsedRanges.filter(
      (page) => page >= 1 && page <= totalPages,
    );

    if (validPages.length === 0) {
      validPages = [1, totalPages];
    }

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(
      pdfDoc,
      validPages.map((page) => page - 1),
    );

    pages.forEach((page) => {
      newPdf.addPage(page);
    });

    const pdfBytes = await newPdf.save();
    const base64 = Buffer.from(pdfBytes).toString("base64");
    setBase64PDF(base64);
  };

  useEffect(() => {
    if (pageRanges) {
      const parsed = parsePageRanges(pageRanges);
      setParsedRanges(parsed);
      if (parsed.length > 0) {
        setPageRange({ start: Math.min(...parsed), end: Math.max(...parsed) });
      }
    }
  }, [pageRanges]);

  useEffect(() => {
    if (selectedFile) {
      processPDF();
    }
  }, [selectedFile, parsedRanges]);

  useEffect(() => {
    const unlistenFnPromise = listen("tauri://drag-drop", async (event) => {
      if (event.event !== "tauri://drag-drop") return;

      const { payload } = event as DragDropEvent;

      // get the file of the first path
      const file = payload.paths[0];

      const normalizedPath = await normalize(file);
      console.log(normalizedPath);

      // TODO: actually be able to read the file since permissions are messed up, or turn off drag and drop and use native api!
      const fileContents = await readFile(normalizedPath);

      console.log(fileContents);

      const fileObj = new File([fileContents], file.split("/").pop() || "untitled", {
        type: "application/pdf",
      });

      setSelectedFile(fileObj);
    });

    return () => {
      unlistenFnPromise.then((unlistenFn) => unlistenFn());
    };
  }, []);
  return (
    <div className="flex flex-col gap-4">
      {!selectedFile && (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF (MAX. 10MB)
              </p>
            </div>
            <Input
              id="dropzone-file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}
      {selectedFile && (
        <>
          <div>
            <Label htmlFor="pageRanges">Pages (e.g., 1-4,8):</Label>
            <Input
              id="pageRanges"
              type="text"
              value={pageRanges}
              onChange={handlePageRangesChange}
              placeholder="1-4,8"
            />
          </div>
          <div>
            <Slider
              value={[pageRange.start, pageRange.end]}
              onValueChange={(values) => {
                setPageRange({ start: values[0], end: values[1] });
                setPageRanges(`${values[0]}-${values[1]}`);
              }}
              min={1}
              max={maxPage}
              minStepsBetweenThumbs={1}
              step={1}
            />
          </div>
          <div className="min-h-[500px] flex">
            {base64PDF && (
              <object
                data={`data:application/pdf;base64,${base64PDF}`}
                type="application/pdf"
                className="flex-1"
              />
            )}
          </div>
          <Button onClick={handleSubmit}>Confirm</Button>
        </>
      )}
    </div>
  );
};
