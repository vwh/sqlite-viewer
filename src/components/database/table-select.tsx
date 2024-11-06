import { useMemo, memo } from "react";
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

function TableSelect() {
  const { tables, selectedTable, setSelectedTable, setIsCustomQuery } =
    useSQLiteStore();

  const selectedTableRowsCount = useMemo(() => {
    const index = Number.parseInt(selectedTable);
    return Number.isNaN(index) ? 0 : tables[index]?.count || 0;
  }, [tables, selectedTable]);

  const selectOptions = useMemo(
    () =>
      tables.map((table, index) => (
        <SelectItem key={table.name} value={`${index}`}>
          {table.name[0].toUpperCase() + table.name.slice(1)}
        </SelectItem>
      )),
    [tables]
  );

  function handleTableChange(value: string) {
    setIsCustomQuery(false);
    setSelectedTable(value);
  }

  return (
    <section className="flex grow items-center justify-center gap-1">
      <Select value={selectedTable} onValueChange={handleTableChange}>
        <SelectTrigger className="grow">
          <SelectValue placeholder="Select a table" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tables</SelectLabel>
            {selectOptions}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Badge
        title="Rows"
        className="hidden min-w-[100px] grow bg-background py-2 text-center text-sm md:block md:min-w-[200px]"
        variant="outline"
      >
        <span className="w-full text-center">{selectedTableRowsCount}</span>
      </Badge>
    </section>
  );
}

export default memo(TableSelect);
