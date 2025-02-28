import { Button } from "@/components/ui/button";
import Sqlite from "./lib/sqlite";
import { useState, useEffect, useMemo, useCallback } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [sqlite, setSqlite] = useState<Sqlite | null>(null);

  const [data, setData] = useState<initSqlJs.QueryExecResult[]>([]);

  const [tables, setTables] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<{
    name: string | null;
    size: number;
  }>({ name: null, size: 1 });
  const [page, setPage] = useState(1);

  useEffect(() => {
    // Initialize the sqlite instance asynchronously.
    async function initDb() {
      const instance = await Sqlite.create();
      const currentTable = instance.tables[0];
      const maxSize = instance.getMaxSizeOfTable(currentTable);

      setSqlite(instance);
      setTables(instance.tables);
      setCurrentTable({ name: currentTable, size: maxSize });
    }
    initDb();
  }, []);

  // Update data when changes occur.
  useEffect(() => {
    if (!sqlite) return;
    if (!currentTable) return;
    setData(sqlite.getTableData(currentTable.name as string, page));
  }, [sqlite, currentTable, page]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      const instance = await Sqlite.open(uint8Array);
      const currentTable = instance.tables[0];
      const maxSize = instance.getMaxSizeOfTable(currentTable);

      setData([]); // Reset data when a new file is selected.
      setTables(instance.tables);
      setCurrentTable({ name: currentTable, size: maxSize });
      setPage(1);
      setSqlite(instance);
    };
    reader.readAsArrayBuffer(file);
  }

  function getTableNames() {
    if (!sqlite) return;
    console.log(sqlite.tables);
  }

  function getDatabaseSchema() {
    if (!sqlite) return;
    console.log(sqlite.schema);
  }

  function handleQueryExecute() {
    if (!sqlite) return;
    const [data, doTablesChanged] = sqlite.exec(query);
    console.log(data);

    if (doTablesChanged) setTables(sqlite.tables); // Update tables after executing a new SQL statement.
  }

  function handleNext() {
    if (!sqlite) return;
    setPage((prev) => prev + 1);
  }

  function handlePrev() {
    if (!sqlite) return;
    setPage((prev) => prev - 1);
  }

  const handleTableChange = useCallback(
    (selectedTable: string) => {
      if (!sqlite) return;
      const maxSize = sqlite.getMaxSizeOfTable(selectedTable);

      setPage(1);
      setCurrentTable({ name: selectedTable, size: maxSize });
    },
    [sqlite]
  );

  const tableButtons = useMemo(
    () =>
      tables.map((table) => (
        <Button key={table} onClick={() => handleTableChange(table)}>
          {table}
        </Button>
      )),
    [tables, handleTableChange]
  );

  // If the sqlite instance is not initialized, return a loading state.
  if (!sqlite) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <input
        type="text"
        placeholder="Enter SQL"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <Button onClick={handleQueryExecute}>Execute SQL</Button>
      <Button onClick={getTableNames}>Get Table Names</Button>
      <Button onClick={getDatabaseSchema}>Get Database Schema</Button>

      <input type="file" onChange={handleFileChange} />

      {tableButtons}

      <div>{JSON.stringify(data, null, 2)}</div>
      <p>
        Page: {page} of {currentTable?.size}
      </p>
      <Button onClick={handleNext} disabled={page >= currentTable?.size}>
        Next
      </Button>
      <Button onClick={handlePrev} disabled={page === 1}>
        Prev
      </Button>
    </div>
  );
}

export default App;
