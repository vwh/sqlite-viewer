import useSQLiteStore from "@/store/useSQLiteStore";
import { useEffect, useCallback, memo } from "react";
import useLocalStorageState, {
  getLocalStorageItem,
  setLocalStorageItem
} from "@/hooks/useLocalStorageState";

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
import { toast } from "sonner";
import {
  DateFormatSection,
  RowsPerPageSection,
  ThemeColorSection
} from "./settings-sections";

import { SettingsIcon } from "lucide-react";

const ROWS_PER_PAGE_KEY = "rowsPerPage";
const DATE_FORMAT_KEY = "dateFormat";
const THEME_COLOR_KEY = "theme-color";
const THEME_COLORS = ["nord", "zinc"];

function Settings() {
  const {
    setRowPerPageOrAuto,
    setIsCustomQuery,
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

  // Set the rows per page to auto if the value is "auto"
  useEffect(() => {
    setRowPerPageOrAuto(isAutoRowsPerPage ? "auto" : Number(rowsPerPage));
  }, [rowsPerPage, setRowPerPageOrAuto, isAutoRowsPerPage]);

  // Set the date format to the stored value
  useEffect(() => {
    setDateFormatValue(getLocalStorageItem(DATE_FORMAT_KEY, "default"));
  }, [setDateFormatValue]);

  // Toggle the theme color class on the body element
  useEffect(() => {
    for (const t of THEME_COLORS)
      document.body?.classList.toggle(t, t === themeColor);
  }, [themeColor]);

  const handleRowsPerPageChange = useCallback(
    (value: string) => {
      setIsCustomQuery(false);

      if (value === "auto" || Number(value) > 0) setRowsPerPage(value);
      else
        toast.error(
          "Please provide a positive number of rows per page or set it to auto."
        );
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

  const handleThemeColorChange = useCallback(
    (value: string) => {
      setThemeColor(value);
    },

    [setThemeColor]
  );

  return (
    <Drawer key="settings-drawer">
      <DrawerTrigger asChild>
        <Button className="grow" title="Open settings drawer">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="hidden">
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Change settings.</DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto flex w-full max-w-sm flex-col gap-3 px-4 md:px-0">
          <RowsPerPageSection
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
          <ThemeColorSection
            themeColor={themeColor}
            onThemeColorChange={handleThemeColorChange}
            themeColors={THEME_COLORS}
          />
          <DateFormatSection
            dateFormatValue={dateFormatValue}
            onDateFormatChange={handleDateFormatChange}
          />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default memo(Settings);
