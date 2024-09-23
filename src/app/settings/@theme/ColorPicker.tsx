import React from "react";
import { Label } from "@/components/tailwind/ui/label";
import { Input } from "@/components/tailwind/ui/input";
import { hslToHex } from "@/lib/themes/colorConversion";

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
  //TODO: colors for the editor specificly heading must be hex values for some reason it doesn't work with hsl
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={`${colorSet}-${colorKey}`} className="w-24">
        {colorKey}
      </Label>
      <Input
        type="color"
        id={`${colorSet}-${colorKey}`}
        value={hexColor}
        onChange={(e) => onColorChange(colorSet, colorKey, e.target.value)}
        className="w-12 h-8 p-0 border-none"
      />
      <Input
        type="text"
        value={color}
        onChange={(e) => onColorChange(colorSet, colorKey, e.target.value)}
        className="w-24"
      />
    </div>
  );
};
