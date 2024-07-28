import { useMemo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { Badge } from "./ui/badge";
import ExportButtons from "./export-buttons";
import { Button } from "./ui/button";

import { ExpandIcon } from "lucide-react";

export default function TableSelect() {
  const { tables, selectedTable, setSelectedTable, expandPage, setExpandPage } =
    useSQLiteStore();

  const selectedTableCount = useMemo(() => {
    const index = parseInt(selectedTable);
    return isNaN(index) ? 0 : tables[index]?.count || 0;
  }, [tables, selectedTable]);

  const tableOptions = useMemo(
    () =>
      tables.map((table, index) => (
        <SelectItem key={table.name} value={`${index}`}>
          {table.name}
        </SelectItem>
      )),
    [tables]
  );

  return (
    <section className="flex items-center justify-center gap-1">
      <Select value={selectedTable} onValueChange={setSelectedTable}>
        <SelectTrigger className="grow">
          <SelectValue placeholder="Select a table" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tables</SelectLabel>
            {tableOptions}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Badge
        title="Rows"
        className="min-w-[100px] grow py-2 text-sm md:min-w-[200px]"
        variant="outline"
      >
        <span className="w-full text-center">{selectedTableCount}</span>
      </Badge>
      <Button
        className="hidden md:block"
        onClick={() => setExpandPage(!expandPage)}
      >
        <ExpandIcon className="h-5 w-5" />
      </Button>
      <ExportButtons />
    </section>
  );
}
