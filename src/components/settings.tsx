import React, { useState, useEffect, useCallback } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

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

import { Settings2Icon } from "lucide-react";

const ROWS_PER_PAGE_KEY = "rowsPerPage";

export default function Settings() {
  const { setRowPerPageOrAuto, setIsCustomQuery, queryHestory } =
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
                onClick={handleSave}
                title="Save rows per page settings"
                variant="outline"
              >
                <span>Save</span>
              </Button>
            </div>
            <div>
              <p className="mb-1 text-sm text-muted-foreground">
                Query History ({queryHestory.length})
              </p>
              <ScrollArea className="h-48 rounded-md border">
                <div className="p-4">
                  {queryHestory.map((query, index) => (
                    <div key={index}>
                      <div className="text-sm">{query}</div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
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
