import useSQLiteStore from "@/store/useSQLiteStore";
import { useMemo, memo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
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
import { ColumnIcon } from "@/components/database/table-decorations";
import { Button } from "../ui/button";
import { TableIcon } from "lucide-react";

function DatabaseSchema() {
  const { tableSchemas } = useSQLiteStore();

  const renderedTables = useMemo(() => {
    return Object.keys(tableSchemas).map((tableName) => (
      <section key={tableName}>
        <h2 className="rounded-t-lg bg-gray-100 p-2 dark:bg-gray-700">
          {tableName}
        </h2>
        <div className="overflow-hidden rounded-b-lg border border-gray-200 dark:border dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Column</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(tableSchemas[tableName]).map(
                ([columnName, columnData]) => (
                  <TableRow key={columnName}>
                    <TableCell>
                      <div className="flex cursor-pointer items-center space-x-1">
                        <span className="max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap">
                          {columnName}
                        </span>
                        <ColumnIcon columnSchema={columnData} />
                      </div>
                    </TableCell>
                    <TableCell>{columnData.type || "Unknown"}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    ));
  }, [tableSchemas]);

  return (
    <Drawer key="table-schema-drawer">
      <DrawerTrigger asChild>
        <Button className="grow" title="Open table schema drawer">
          <TableIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="hidden">
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>Change settings.</DrawerDescription>
        </DrawerHeader>
        <section className="flex grow flex-col gap-2 px-4 md:px-0">
          <div className="mx-auto flex max-h-[500px] w-full max-w-xl flex-col gap-3 overflow-y-auto p-2">
            {renderedTables}
          </div>
          <div className="mx-auto w-full max-w-sm">
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </section>
      </DrawerContent>
    </Drawer>
  );
}

export default memo(DatabaseSchema);
