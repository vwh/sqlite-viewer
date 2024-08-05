import useSQLiteStore from "@/store/useSQLiteStore";
import { useEffect, useCallback } from "react";
import useLocalStorageState, {
  getLocalStorageItem,
  setLocalStorageItem
} from "@/hooks/useLocalStorageState";

import { dateFormats } from "@/lib/date-format";

import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { SettingsIcon } from "lucide-react";

const ROWS_PER_PAGE_KEY = "rowsPerPage";
const DATE_FORMAT_KEY = "dateFormat";
const THEME_COLOR_KEY = "theme-color";
const THEME_COLORS = ["old", "slate", "blue", "nord"];

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
}

interface QueryHistorySectionProps {
  queryHistory: string[];
}

export default function Settings() {
  const {
    setRowPerPageOrAuto,
    setIsCustomQuery,
    queryHestory,
    dateFormatValue,
    setDateFormatValue
  } = useSQLiteStore();

  const [rowsPerPage, setRowsPerPage] = useLocalStorageState(
    ROWS_PER_PAGE_KEY,
    "30"
  );
  const [themeColor, setThemeColor] = useLocalStorageState(
    THEME_COLOR_KEY,
    "default"
  );

  const isAutoRowsPerPage = rowsPerPage === "auto";

  useEffect(() => {
    setRowPerPageOrAuto(isAutoRowsPerPage ? "auto" : Number(rowsPerPage));
  }, [rowsPerPage, setRowPerPageOrAuto]);

  useEffect(() => {
    setDateFormatValue(getLocalStorageItem(DATE_FORMAT_KEY, "default"));
  }, [setDateFormatValue]);

  useEffect(() => {
    THEME_COLORS.forEach((t) =>
      document.body?.classList.toggle(t, t === themeColor)
    );
  }, [themeColor]);

  const handleRowsPerPageChange = useCallback(
    (value: string) => {
      setIsCustomQuery(false);
      if (value === "auto" || Number(value) > 0) {
        setRowsPerPage(value);
      } else {
        toast.error(
          "Please provide a positive number of rows per page or set it to auto."
        );
      }
    },
    [setIsCustomQuery, setRowsPerPage]
  );

  const handleDateFormatChange = useCallback(
    (value: string) => {
      setDateFormatValue(value);
      setLocalStorageItem(DATE_FORMAT_KEY, value);
    },
    [setDateFormatValue]
  );

  const handleThemeChange = useCallback(
    (value: string) => {
      setThemeColor(value);
    },
    [setThemeColor]
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="grow" title="Open settings drawer">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>
              Personalize your site experience here.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 p-4 pb-0">
            <RowsPerPageSection
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
            <section className="flex justify-between">
              <DateFormatSection
                dateFormatValue={dateFormatValue}
                onDateFormatChange={handleDateFormatChange}
              />
              <ThemeChangeSection
                themeColor={themeColor}
                onThemeChange={handleThemeChange}
              />
            </section>
            <QueryHistorySection queryHistory={queryHestory} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button title="Close settings drawer" variant="outline">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RowsPerPageSection({
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

function DateFormatSection({
  dateFormatValue,
  onDateFormatChange
}: DateFormatSectionProps) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">Date type format</p>
      <RadioGroup
        className="flex flex-col gap-2"
        name="dateType"
        value={dateFormatValue}
        onValueChange={onDateFormatChange}
      >
        <DateFormatOption value="default" label="Default" />
        {Object.entries(dateFormats).map(([key, { label }]) => (
          <DateFormatOption key={key} value={key} label={label} />
        ))}
      </RadioGroup>
    </div>
  );
}

function ThemeChangeSection({
  themeColor,
  onThemeChange
}: ThemeChangeSectionProps) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">Theme Color</p>
      <RadioGroup
        className="flex flex-col gap-2"
        name="themeColor"
        value={themeColor}
        onValueChange={onThemeChange}
      >
        <DateFormatOption value="default" label="Default" />
        {THEME_COLORS.map((theme) => (
          <DateFormatOption key={theme} value={theme} label={theme} />
        ))}
      </RadioGroup>
    </div>
  );
}

function QueryHistorySection({ queryHistory }: QueryHistorySectionProps) {
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

interface DateFormatOptionProps {
  value: string;
  label: string;
}

function DateFormatOption({ value, label }: DateFormatOptionProps) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={value} id={`r-${value}`} />
      <Label htmlFor={`r-${value}`}>{label}</Label>
    </div>
  );
}
