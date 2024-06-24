import { useEffect, useState } from "react";
import useSQLiteStore from "./store/useSQLiteStore";

import { DBTable } from "./components/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Separator } from "./components/ui/separator";
import { Badge } from "./components/ui/badge";

function App() {
  const { db, query, loadDatabase, tables, setTables } = useSQLiteStore();
  const [selectedTable, setSelectedTable] = useState<string>("0");

  useEffect(() => {
    if (db) {
      const tablesResult = query(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      if (tablesResult.length > 0) {
        const tableNames = tablesResult[0].values.map((row) => row[0]);
        console.log("Table Names:", tableNames); // Log table names for debugging

        const tableCountsPromises = tableNames.map(async (tableName) => {
          const countResult = query(`SELECT COUNT(*) FROM "${tableName}"`);
          try {
            const count = parseInt(countResult[0].values[0][0] as string, 10);
            return { name: tableName as string, count };
          } catch (error) {
            console.error(`Error querying table ${tableName}:`, error);
            return { name: tableName as string, count: 0 };
          }
        });

        Promise.all(tableCountsPromises).then((tablesWithCounts) => {
          console.log("Tables with row counts:", tablesWithCounts);
          setTables(tablesWithCounts);
        });
      }
    }
  }, [db, query, setTables]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setTables([]);
      setSelectedTable("0");
      await loadDatabase(file);
    }
  };

  return (
    <>
      <div>
        <h1>SQLite File Loader</h1>
        <input type="file" onChange={handleFileChange} />
      </div>
      {db && tables.length > 0 && (
        <>
          <section className="flex justify-center items-center gap-2">
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger className="w-[300px]">
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
          <Separator className="mt-2" />
          {tables[parseInt(selectedTable)] && (
            <DBTable
              tableName={tables[parseInt(selectedTable)].name}
              rowCount={tables[parseInt(selectedTable)].count}
            />
          )}
        </>
      )}
    </>
  );

  return <div>Loading...</div>;
}

export default App;
