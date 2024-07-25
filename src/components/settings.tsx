import React, { useState, useEffect, useCallback, useMemo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import {
  exportTableAsCSV,
  exportAllTablesAsCSV,
  downloadDatabase
} from "@/lib/sqlite";

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
import { Settings2 } from "lucide-react";

const ROWS_PER_PAGE_KEY = "rowsPerPage";

export default function Settings() {
  const { setRowPerPageOrAuto, selectedTable, setIsCustomQuery, db } =
    useSQLiteStore();
  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState<number | null>(
    null
  );
  const [isAutoRowsPerPage, setIsAutoRowsPerPage] = useState(false);

  useEffect(() => {
    const rowsPerPageLocalStorage = localStorage.getItem(ROWS_PER_PAGE_KEY);
    if (rowsPerPageLocalStorage) {
      if (rowsPerPageLocalStorage === "auto") {
        setIsAutoRowsPerPage(true);
      } else {
        const parsedValue = Number(rowsPerPageLocalStorage);
        setSelectedRowsPerPage(parsedValue);
        setRowPerPageOrAuto(parsedValue);
      }
    }
  }, [setRowPerPageOrAuto]);

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

  const handleSave = useCallback(() => {
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

  const renderExportButton = useCallback(
    (onClick: () => void, label: string, className?: string) => (
      <Button variant="outline" onClick={onClick} className={className}>
        <span className="ml-2">{label}</span>
      </Button>
    ),
    []
  );

  const exportButtons = useMemo(
    () =>
      db && (
        <div className="flex flex-col gap-1 rounded border p-2">
          {renderExportButton(() => downloadDatabase(db), "Export as SQLite")}
          {renderExportButton(
            () => exportTableAsCSV(db, parseInt(selectedTable)),
            "Export selected table as CSV"
          )}
          {renderExportButton(
            () => exportAllTablesAsCSV(db),
            "Export all tables as CSV"
          )}
        </div>
      ),
    [db, renderExportButton, selectedTable]
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="grow">
          <Settings2 className="h-5 w-5" />
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
            <div>
              <p className="mb-1 text-sm text-muted-foreground">
                Rows Per Page
              </p>
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
                  onClick={toggleAutoRowsPerPage}
                  variant="outline"
                  className={isAutoRowsPerPage ? "border border-primary" : ""}
                >
                  Auto Calculate
                </Button>
              </div>
              <Button
                className="mt-2 w-full"
                onClick={handleSave}
                variant="outline"
              >
                <span>Save</span>
              </Button>
            </div>
            <div>
              <p className="mb-1 text-sm text-muted-foreground">
                Exports Settings
              </p>
              {exportButtons}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
