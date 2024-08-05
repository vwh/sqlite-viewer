import useSQLiteStore from "@/store/useSQLiteStore";
import { useEffect, useCallback } from "react";
import useLocalStorageState, {
  getLocalStorageItem,
  setLocalStorageItem
} from "@/hooks/useLocalStorageState";

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
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  DateFormatSection,
  RowsPerPageSection,
  ThemeChangeSection,
  QueryHistorySection
} from "./settings-sections";

import { SettingsIcon } from "lucide-react";

const ROWS_PER_PAGE_KEY = "rowsPerPage";
const DATE_FORMAT_KEY = "dateFormat";
const THEME_COLOR_KEY = "theme-color";
const THEME_COLORS = ["slate", "blue", "nord", "old"];

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
    "auto"
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
                themeColors={THEME_COLORS}
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
