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

export const PDFImport = ({ onClose }: { onClose: () => void }) => {
  const { addInputMessageContext } = useAIMessages();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState<{ start: number; end: number }>({
    start: 1,
    end: 1,
  });
  const [maxPage, setMaxPage] = useState<number>(1);
  const [base64PDF, setBase64PDF] = useState<string>("");

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();
        setPageRange({ start: 1, end: totalPages });
        setMaxPage(totalPages);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPageRange((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const processPDF = async () => {
    if (!selectedFile) return;

    const arrayBuffer = await selectedFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const totalPages = pdfDoc.getPageCount();
    setMaxPage(totalPages);
    const { start, end } = pageRange;

    if (start < 1 || end > totalPages || start > end) {
      alert("Invalid page range.");
      return;
    }

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(
      pdfDoc,
      // @ts-ignore
      [...Array(end - start + 1).keys()].map((i) => i + start - 1),
    );

    pages.forEach((page) => {
      newPdf.addPage(page);
    });

    const pdfBytes = await newPdf.save();
    const base64 = Buffer.from(pdfBytes).toString("base64");
    setBase64PDF(base64);
  };

  useEffect(() => {
    if (selectedFile && pageRange.start && pageRange.end) {
      if (pageRange.start > pageRange.end) return;

      processPDF();
    }
  }, [selectedFile, pageRange]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <Slider
          value={[pageRange.start, pageRange.end]}
          onValueChange={(values) => {
            setPageRange({ start: values[0], end: values[1] });
          }}
          min={1}
          max={maxPage}
          minStepsBetweenThumbs={1}
          step={1}
        />
        <div className="flex justify-between">
          <div className="flex-1">
            <Label htmlFor="start">Start Page</Label>
            <Input
              id="start"
              type="number"
              name="start"
              value={pageRange.start}
              onChange={handleRangeChange}
              min={1}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="end">End Page</Label>
            <Input
              id="end"
              type="number"
              name="end"
              value={pageRange.end}
              onChange={handleRangeChange}
              min={pageRange.start}
            />
          </div>
        </div>
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
    </div>
  );
};
