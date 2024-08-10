import { dateFormats } from "@/lib/date-format";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

import {
  Rows3Icon,
  CalendarIcon,
  PaletteIcon,
  HistoryIcon
} from "lucide-react";

type OptionProps = {
  value: string;
  label: string;
};

const Option: React.FC<OptionProps> = ({ value, label }) => (
  <div className="flex items-center space-x-2">
    <RadioGroupItem value={value} id={`r-${value}`} />
    <Label htmlFor={`r-${value}`}>{label}</Label>
  </div>
);

type RowsPerPageSectionProps = {
  rowsPerPage: string;
  onRowsPerPageChange: (value: string) => void;
};

export const RowsPerPageSection: React.FC<RowsPerPageSectionProps> = ({
  rowsPerPage,
  onRowsPerPageChange
}) => {
  const isAutoRowsPerPage = rowsPerPage === "auto";

  return (
    <div className="flex h-full grow flex-col gap-1">
      <div className="flex items-center gap-1">
        <Rows3Icon className="h-4 w-4" />
        <p className="text-sm font-medium">Rows Per Page</p>
      </div>
      <div className="flex h-full flex-col items-center justify-center gap-1 rounded border p-2">
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
          variant={isAutoRowsPerPage ? "secondary" : "outline"}
          onClick={() => onRowsPerPageChange("auto")}
          className="w-full whitespace-nowrap"
        >
          Auto Calculate
        </Button>
      </div>
    </div>
  );
};

type DateFormatSectionProps = {
  dateFormatValue: string;
  onDateFormatChange: (value: string) => void;
};

export const DateFormatSection: React.FC<DateFormatSectionProps> = ({
  dateFormatValue,
  onDateFormatChange
}) => (
  <div className="flex h-full grow flex-col gap-1">
    <div className="flex items-center gap-1">
      <CalendarIcon className="h-4 w-4" />
      <p className="text-sm font-medium">Date Format</p>
    </div>
    <div className="h-full rounded border p-2">
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

type ThemeColorSectionProps = {
  themeColor: string;
  onThemeColorChange: (value: string) => void;
  themeColors: string[];
};

export const ThemeColorSection: React.FC<ThemeColorSectionProps> = ({
  themeColor,
  onThemeColorChange,
  themeColors
}) => (
  <div className="flex grow flex-col gap-1">
    <div className="flex items-center gap-1">
      <PaletteIcon className="h-4 w-4" />
      <p className="text-sm font-medium">Theme Color</p>
    </div>
    <RadioGroup
      className="flex flex-col gap-2 rounded border p-2"
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

type QueryHistorySectionProps = {
  queryHistory: string[];
};

export const QueryHistorySection: React.FC<QueryHistorySectionProps> = ({
  queryHistory
}) => (
  <div className="flex grow flex-col gap-1">
    <div className="flex items-center gap-1">
      <HistoryIcon className="h-4 w-4" />
      <p className="text-sm font-medium">
        Query History ({queryHistory.length})
      </p>
    </div>
    <ScrollArea className="h-[155px] rounded-md border font-medium">
      <div className="p-4">
        {queryHistory.map((query, index) => (
          <div key={index}>
            <div className="text-sm font-normal">{query}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);
