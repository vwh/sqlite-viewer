import useSQLiteStore from "../store/useSQLiteStore";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";

export function TableSelect() {
  const { tables, selectedTable, setSelectedTable } = useSQLiteStore();
  return (
    <section className="flex justify-center items-center gap-2">
      <Select value={selectedTable} onValueChange={setSelectedTable}>
        <SelectTrigger className="w-[200px] md:w-[300px]">
          <SelectValue placeholder="Select a table" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tables</SelectLabel>
            {tables.map((table, index) => (
              <SelectItem key={table.name} value={`${index}`}>
                {table.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Badge className="text-sm">
        {tables[parseInt(selectedTable)].count} rows
      </Badge>
    </section>
  );
}
