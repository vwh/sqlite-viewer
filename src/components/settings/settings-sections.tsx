import { dateFormats } from "@/lib/date-format";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface RowsPerPageSectionProps {
  rowsPerPage: string;
  onRowsPerPageChange: (value: string) => void;
}

interface DateFormatSectionProps {
  dateFormatValue: string;
  onDateFormatChange: (value: string) => void;
}

interface ThemeChangeSectionProps {
  themeColor: string;
  onThemeChange: (value: string) => void;
  themeColors: string[];
}

interface QueryHistorySectionProps {
  queryHistory: string[];
}

interface OptionProps {
  value: string;
  label: string;
}

export function RowsPerPageSection({
  rowsPerPage,
  onRowsPerPageChange
}: RowsPerPageSectionProps) {
  const isAutoRowsPerPage = rowsPerPage === "auto";

  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">Rows Per Page</p>
      <div className="flex items-center justify-center gap-1 rounded border p-2">
        <Input
          value={isAutoRowsPerPage ? "" : rowsPerPage}
          onChange={(e) => onRowsPerPageChange(e.target.value)}
          placeholder="Number of rows"
          type="number"
          name="rowsPerPage"
        />
        <span className="h-full text-center text-sm text-muted-foreground">
          OR
        </span>
        <Button
          className={isAutoRowsPerPage ? "border border-primary" : ""}
          onClick={() => onRowsPerPageChange("auto")}
          title="Toggle auto rows per page"
          variant="outline"
        >
          Auto Calculate
        </Button>
      </div>
    </div>
  );
}

export function DateFormatSection({
  dateFormatValue,
  onDateFormatChange
}: DateFormatSectionProps) {
  return (
    <div className="flex grow flex-col gap-1">
      <p className="text-sm text-muted-foreground">Date Type Format</p>
      <div className="rounded border p-2">
        <RadioGroup
          className="flex flex-col gap-2"
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

export function ThemeChangeSection({
  themeColor,
  onThemeChange,
  themeColors
}: ThemeChangeSectionProps) {
  return (
    <div className="flex grow flex-col gap-1">
      <p className="text-sm text-muted-foreground">Theme Color</p>
      <RadioGroup
        className="flex flex-col gap-2 rounded border p-2"
        name="themeColor"
        value={themeColor}
        onValueChange={onThemeChange}
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

export function QueryHistorySection({
  queryHistory
}: QueryHistorySectionProps) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">
        Query History ({queryHistory.length})
      </p>
      <ScrollArea className="h-[155px] rounded-md border">
        <div className="p-4">
          {queryHistory.map((query, index) => (
            <div key={index}>
              <div className="text-xs">{query}</div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function Option({ value, label }: OptionProps) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={`r-${value}`} />
      <Label htmlFor={`r-${value}`}>{label}</Label>
    </div>
  );
}
