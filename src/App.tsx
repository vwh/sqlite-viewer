import { useState, useEffect, useMemo, useCallback } from "react";

import Sqlite from "./lib/sqlite";

import type { Schema } from "./types";

import { Button } from "@/components/ui/button";

export default function App() {
  const [query, setQuery] = useState("");
  const [sqlite, setSqlite] = useState<Sqlite | null>(null);
  const [schema, setSchema] = useState<Schema>(new Map());

  const [data, setData] = useState<initSqlJs.QueryExecResult[] | null>();
  const [isUserCustomQuery, setIsUserCustomQuery] = useState(false);

  const [tables, setTables] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<{
    name: string | null;
    size: number;
  }>({ name: null, size: 1 });
  const [page, setPage] = useState(1);

  // Initialize the sqlite instance asynchronously.
  useEffect(() => {
    async function initDb() {
      const instance = await Sqlite.create();
      const currentTable = instance.tables[0];
      const maxSize = instance.getMaxSizeOfTable(currentTable);

      setTables(instance.tables);
      setSchema(instance.schema);
      setCurrentTable({ name: currentTable, size: maxSize });
      setSqlite(instance);
    }
    initDb();
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setSchema(instance.schema);
        setCurrentTable({ name: currentTable, size: maxSize });
        setPage(1);
        setSqlite(instance);
      };
      reader.readAsArrayBuffer(file);
    },
    []
  );

  // Update data when changes occur.
  useEffect(() => {
    if (!sqlite || !currentTable) return;
    setData(sqlite.getTableData(currentTable.name as string, page));
  }, [sqlite, currentTable, page]);

  const handleQueryExecute = useCallback(() => {
    if (!sqlite) return;
    // Remove SQL comments before processing
    const cleanedQuery = query
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
    // Split the query into multiple statements.
    const statments = cleanedQuery
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt !== "");

    for (const stmt of statments) {
      const [data, doTablesChanged] = sqlite.exec(stmt);
      // If it is CREATE/DROP/ALTER statement, update tables and schema.
      if (doTablesChanged) {
        setTables(sqlite.tables);
        setSchema(sqlite.schema);
      } else {
        // Else if it is a SELECT statement, update data.
        if (data.length > 0) {
          setIsUserCustomQuery(true);
          setData(data);
        }
        // Else if it is an INSERT/UPDATE/DELETE statement, update data.
        else {
          // Update data after executing a new SQL statement.
          setData(sqlite.getTableData(currentTable.name as string, page));
          const maxSize = sqlite.getMaxSizeOfTable(currentTable.name as string);
          // Update current table after executing a new SQL statement.
          setCurrentTable({ name: currentTable.name, size: maxSize });
        }
      }
    }
  }, [query, sqlite, currentTable, page]);

  const handlePageChange = useCallback((type: "next" | "prev") => {
    if (type === "next") {
      setPage((prev) => prev + 1);
    } else {
      setPage((prev) => prev - 1);
    }
  }, []);

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
      <textarea
        placeholder="Enter SQL"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button onClick={handleQueryExecute}>Execute SQL</Button>
      <input type="file" onChange={handleFileChange} />

      {tableButtons}

      {data?.[0] && "columns" in data[0] ? (
        <>
          <div>
            {data[0]?.columns.map((column) => (
              <span className="p-2" key={column}>
                {column}
              </span>
            ))}
          </div>
          <div>
            {data[0]?.values.map((row, i) => (
              <div key={i}>
                {row.map((value, j) => (
                  <span className="p-2" key={j}>
                    {value}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No data</p>
      )}

      <p>
        Page: {page} of {currentTable?.size}
      </p>
      <Button
        onClick={() => handlePageChange("next")}
        disabled={page >= currentTable?.size}
      >
        Next
      </Button>
      <Button onClick={() => handlePageChange("prev")} disabled={page === 1}>
        Prev
      </Button>
    </div>
  );
}
