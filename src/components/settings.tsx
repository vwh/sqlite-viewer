import useSQLiteStore from "@/store/useSQLiteStore";
import React, { useState, useEffect, useCallback } from "react";

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

import { Settings2Icon } from "lucide-react";

const ROWS_PER_PAGE_KEY = "rowsPerPage";
const DATE_FORMAT_KEY = "dateFormat";

export default function Settings() {
  const {
    setRowPerPageOrAuto,
    setIsCustomQuery,
    queryHestory,
    dateFormatValue,
    setDateFormatValue
  } = useSQLiteStore();

  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState<number | null>(
    null
  );
  const [isAutoRowsPerPage, setIsAutoRowsPerPage] = useState(false);

  useEffect(() => {
    const rowsPerPageLocalStorage = localStorage.getItem(ROWS_PER_PAGE_KEY);
    const dateFormatLocalStorage = localStorage.getItem(DATE_FORMAT_KEY);

    if (rowsPerPageLocalStorage) {
      if (rowsPerPageLocalStorage === "auto") {
        setIsAutoRowsPerPage(true);
      } else {
        const parsedValue = Number(rowsPerPageLocalStorage);
        setSelectedRowsPerPage(parsedValue);
        setRowPerPageOrAuto(parsedValue);
      }
    }

    if (dateFormatLocalStorage) {
      setDateFormatValue(dateFormatLocalStorage);
    }
  }, [setRowPerPageOrAuto, setDateFormatValue]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      if (!isNaN(value)) {
        setSelectedRowsPerPage(value);
        setIsAutoRowsPerPage(false);
      }
    },
    []
  );

  const toggleAutoRowsPerPage = useCallback(() => {
    setIsAutoRowsPerPage((prev) => !prev);
  }, []);

  const handleRowsPerPageSave = useCallback(() => {
    setIsCustomQuery(false);
    if (selectedRowsPerPage === null) {
      toast.error(
        "Please provide a number of rows per page or set it to auto."
      );
      return;
    }
    if (selectedRowsPerPage < 1) {
      toast.error("Please provide a positive number of rows per page.");
      return;
    }
    const value = isAutoRowsPerPage ? "auto" : selectedRowsPerPage.toString();
    localStorage.setItem(ROWS_PER_PAGE_KEY, value);
    setRowPerPageOrAuto(isAutoRowsPerPage ? "auto" : selectedRowsPerPage);
  }, [
    selectedRowsPerPage,
    isAutoRowsPerPage,
    setIsCustomQuery,
    setRowPerPageOrAuto
  ]);

  const handleDateFormatChange = (value: string) => {
    setDateFormatValue(value);
    localStorage.setItem(DATE_FORMAT_KEY, value);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="grow" title="Open settings drawer">
          <Settings2Icon className="h-5 w-5" />
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
              selectedRowsPerPage={selectedRowsPerPage}
              isAutoRowsPerPage={isAutoRowsPerPage}
              handleInputChange={handleInputChange}
              toggleAutoRowsPerPage={toggleAutoRowsPerPage}
              handleRowsPerPageSave={handleRowsPerPageSave}
            />
            <DateFormatSection
              dateFormatValue={dateFormatValue}
              handleDateFormatChange={handleDateFormatChange}
            />
            <QueryHistorySection queryHestory={queryHestory} />
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

interface RowsPerPageSectionProps {
  selectedRowsPerPage: number | null;
  isAutoRowsPerPage: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleAutoRowsPerPage: () => void;
  handleRowsPerPageSave: () => void;
}

function RowsPerPageSection({
  selectedRowsPerPage,
  isAutoRowsPerPage,
  handleInputChange,
  toggleAutoRowsPerPage,
  handleRowsPerPageSave
}: RowsPerPageSectionProps) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">Rows Per Page</p>
      <div className="flex items-center justify-center gap-1 rounded border p-2">
        <Input
          value={selectedRowsPerPage || ""}
          onChange={handleInputChange}
          disabled={isAutoRowsPerPage}
          placeholder="Number of rows"
          type="number"
          name="rowsPerPage"
        />
        <span className="h-full text-center text-sm text-muted-foreground">
          OR
        </span>
        <Button
          className={isAutoRowsPerPage ? "border border-primary" : ""}
          onClick={toggleAutoRowsPerPage}
          title="Toggle auto rows per page"
          variant="outline"
        >
          Auto Calculate
        </Button>
      </div>
      <Button
        className="mt-2 w-full"
        onClick={handleRowsPerPageSave}
        title="Save rows per page settings"
        variant="outline"
      >
        <span>Save</span>
      </Button>
    </div>
  );
}

interface DateFormatSectionProps {
  dateFormatValue: string;
  handleDateFormatChange: (value: string) => void;
}

function DateFormatSection({
  dateFormatValue,
  handleDateFormatChange
}: DateFormatSectionProps) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">Date type format</p>
      <RadioGroup
        className="flex flex-col gap-2"
        name="dateType"
        value={dateFormatValue}
        onValueChange={handleDateFormatChange}
      >
        <DateFormatOption value="default" label="Default" />
        {Object.keys(dateFormats).map((key) => (
          <DateFormatOption
            key={key}
            value={key}
            label={dateFormats[key].label}
          />
        ))}
      </RadioGroup>
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

interface QueryHistorySectionProps {
  queryHestory: string[];
}

function QueryHistorySection({ queryHestory }: QueryHistorySectionProps) {
  return (
    <div>
      <p className="mb-1 text-sm text-muted-foreground">
        Query History ({queryHestory.length})
      </p>
      <ScrollArea className="h-48 rounded-md border">
        <div className="p-4">
          {queryHestory.map((query, index) => (
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
