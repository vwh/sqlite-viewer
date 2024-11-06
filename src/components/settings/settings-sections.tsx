import { dateFormats } from "@/lib/date-format";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

import { Rows3Icon, CalendarIcon, PaletteIcon } from "lucide-react";

type OptionProps = {
  value: string;
  label: string;
};

function Option({ value, label }: OptionProps) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={`r-${value}`} />
      <Label htmlFor={`r-${value}`}>{label}</Label>
    </div>
  );
}

type RowsPerPageSectionProps = {
  rowsPerPage: string;
  onRowsPerPageChange: (value: string) => void;
};

export function RowsPerPageSection({
  rowsPerPage,
  onRowsPerPageChange
}: RowsPerPageSectionProps) {
  const isAutoRowsPerPage = rowsPerPage === "auto";

  return (
    <div className="flex h-full grow flex-col gap-1">
      <div className="flex items-center gap-1">
        <Rows3Icon className="h-4 w-4" />
        <p className="text-sm font-medium">Rows Per Page</p>
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-1 rounded border bg-gray-100/50 p-2 dark:bg-gray-700/50">
        <Input
          id="rowsPerPage"
          value={isAutoRowsPerPage ? "" : rowsPerPage}
          onChange={(e) => onRowsPerPageChange(e.target.value)}
          placeholder="Number of rows"
          type="number"
          className="w-full"
          autoFocus={false}
        />
        <Button
          variant="outline"
          onClick={() => onRowsPerPageChange("auto")}
          className="w-full whitespace-nowrap"
        >
          Auto Calculate
        </Button>
      </div>
    </div>
  );
}

type DateFormatSectionProps = {
  dateFormatValue: string;
  onDateFormatChange: (value: string) => void;
};

export function DateFormatSection({
  dateFormatValue,
  onDateFormatChange
}: DateFormatSectionProps) {
  return (
    <div className="flex h-full grow flex-col gap-1">
      <div className="flex items-center gap-1">
        <CalendarIcon className="h-4 w-4" />
        <p className="text-sm font-medium">Date Format</p>
      </div>
      <div className="h-full rounded border bg-gray-100/50 p-2 dark:bg-gray-700/50">
        <RadioGroup
          className="flex h-full flex-col gap-2"
          name="dateType"
          value={dateFormatValue}
          onValueChange={onDateFormatChange}
        >
          <Option value="default" label="Default" />
          {Object.entries(dateFormats).map(([key, { label }]) => (
            <Option key={key} value={key} label={label} />
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

type ThemeColorSectionProps = {
  themeColor: string;
  onThemeColorChange: (value: string) => void;
  themeColors: string[];
};

export function ThemeColorSection({
  themeColor,
  onThemeColorChange,
  themeColors
}: ThemeColorSectionProps) {
  return (
    <div className="flex grow flex-col gap-1">
      <div className="flex items-center gap-1">
        <PaletteIcon className="h-4 w-4" />
        <p className="text-sm font-medium">Theme Color</p>
      </div>
      <RadioGroup
        className="flex flex-col gap-2 rounded border bg-gray-100/50 p-2 dark:bg-gray-700/50"
        name="themeColor"
        value={themeColor}
        onValueChange={onThemeColorChange}
      >
        <Option value="default" label="Default" />
        {themeColors.map((theme) => (
          <Option
            key={theme}
            value={theme}
            label={theme[0].toUpperCase() + theme.slice(1)}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
