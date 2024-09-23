// components/ColorPicker.tsx
import React from "react";
import { Label } from "@/components/tailwind/ui/label";
import { Input } from "@/components/tailwind/ui/input";
import { hexToHsl, hslToHex } from "@/lib/themes/colorConversion";

interface ColorPickerProps {
  colorSet: "app" | "editor";
  colorKey: string;
  color: string;
  onColorChange: (
    colorSet: "app" | "editor",
    key: string,
    value: string,
  ) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colorSet,
  colorKey,
  color,
  onColorChange,
}) => {
  const [h, s, l] = color.split(" ").map((v) => parseFloat(v));
  const hexColor = hslToHex(h, s, l);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hslValue = hexToHsl(e.target.value);
    if (hslValue) {
      onColorChange(colorSet, colorKey, hslValue);
    }
  };

  const handleHslChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(colorSet, colorKey, e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={`${colorSet}-${colorKey}`} className="w-24">
        {colorKey}
      </Label>
      <Input
        type="color"
        id={`${colorSet}-${colorKey}`}
        value={hexColor}
        onChange={handleHexChange}
        className="w-12 h-8 p-0 border-none"
      />
      <Input
        type="text"
        value={color}
        onChange={handleHslChange}
        className="w-36"
      />
    </div>
  );
};
