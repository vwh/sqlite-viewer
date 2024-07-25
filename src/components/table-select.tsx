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

export default function TableSelect() {
  const { tables, selectedTable, setSelectedTable } = useSQLiteStore();
  return (
    <section className="flex justify-center items-center gap-2">
      <Select value={selectedTable} onValueChange={setSelectedTable}>
        <SelectTrigger className="grow">
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
      <Badge
        title="Rows"
        className="text-sm grow min-w-[100px] md:min-w-[200px] py-2"
        variant="outline"
      >
        <span className="text-center w-full">
          {tables[parseInt(selectedTable)].count}
        </span>
      </Badge>
    </section>
  );
}
