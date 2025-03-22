import { useMemo } from "react";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Span } from "@/components/ui/span";

const TableSelector = () => {
  const { handleTableChange } = useDatabaseWorker();
  const tablesSchema = useDatabaseStore((state) => state.tablesSchema);
  const currentTable = useDatabaseStore((state) => state.currentTable);

  const TableSelect = useMemo(
    () => (
      <Select
        onValueChange={handleTableChange}
        value={currentTable || undefined}
      >
        <SelectTrigger className="border-primary/20 h-8 w-30 border text-sm sm:w-48">
          <SelectValue placeholder="Select Table" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(tablesSchema).map((table) => (
            <SelectItem key={table} value={table}>
              <Span className="capitalize">{table}</Span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    [tablesSchema, currentTable, handleTableChange]
  );

  return TableSelect;
};

export default TableSelector;
