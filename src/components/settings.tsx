import useSQLiteStore from "../store/useSQLiteStore";

import { useState, useEffect } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { Settings2 } from "lucide-react";

export default function Settings() {
  const {
    setRowPerPageOrAuto,
    downloadDatabase,
    exportAllTablesAsCSV,
    exportTableAsCSV,
    selectedTable,
  } = useSQLiteStore();

  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState<number>(30);
  const [isAutoRowsPerPage, setIsAutoRowsPerPage] = useState(false);

  useEffect(() => {
    if (isAutoRowsPerPage) {
      setSelectedRowsPerPage(30);
    }
  }, [isAutoRowsPerPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setSelectedRowsPerPage(value);
      setIsAutoRowsPerPage(false);
    }
  };

  const toggleAutoRowsPerPage = () => {
    setIsAutoRowsPerPage((prev) => !prev);
  };

  const handleSave = () => {
    if (isAutoRowsPerPage) {
      setRowPerPageOrAuto("auto");
    } else {
      setRowPerPageOrAuto(selectedRowsPerPage);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
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
          <div className="p-4 pb-0 flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Rows per page
              </p>
              <div className="border rounded p-2 flex gap-1 justify-center items-center">
                <Input
                  min="3"
                  max="500"
                  value={selectedRowsPerPage}
                  onChange={handleInputChange}
                  disabled={isAutoRowsPerPage}
                  placeholder="30"
                  type="number"
                  name="rowsPerPage"
                />
                <span className="text-sm text-muted-foreground h-full text-center">
                  OR
                </span>
                <Button
                  onClick={toggleAutoRowsPerPage}
                  variant="outline"
                  className={
                    isAutoRowsPerPage ? "border border-primary" : undefined
                  }
                >
                  Auto calculate
                </Button>
              </div>
              <Button className="w-full mt-2" onClick={handleSave}>
                <span>Save</span>
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Exports Settings
              </p>
              <div className="border rounded p-2 flex flex-col gap-1">
                <Button variant="outline" onClick={downloadDatabase}>
                  <span className="ml-2">Export as SQLite</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportTableAsCSV(parseInt(selectedTable))}
                >
                  <span className="ml-2">Export selected table as CSV</span>
                </Button>
                <Button variant="outline" onClick={exportAllTablesAsCSV}>
                  <span className="ml-2">Export all tables as CSV</span>
                </Button>
              </div>
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
