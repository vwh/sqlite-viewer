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
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function TableSelect() {
  const { tables, selectedTable, setSelectedTable, setIsCustomQuery } =
    useSQLiteStore();

  const selectedTableCount = useMemo(() => {
    const index = parseInt(selectedTable);
    return isNaN(index) ? 0 : tables[index]?.count || 0;
  }, [tables, selectedTable]);

  const tableOptions = useMemo(
    () =>
      tables.map((table, index) => (
        <SelectItem key={table.name} value={`${index}`}>
          {table.name[0].toUpperCase() + table.name.slice(1)}
        </SelectItem>
      )),
    [tables]
  );

  function onSelectedTable(value: string) {
    setIsCustomQuery(false);
    setSelectedTable(value);
  }

  return (
    <section className="flex grow items-center justify-center gap-1">
      <Select value={selectedTable} onValueChange={onSelectedTable}>
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
    </section>
  );
}
