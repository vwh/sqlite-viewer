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

  const [filters, setFilters] = useState<Record<string, string> | null>(null);

  const [tables, setTables] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<string | null>(null);

  const [maxSize, setMaxSize] = useState<number>(1);
  const [page, setPage] = useState(1);

  // Initialize the sqlite instance asynchronously.
  useEffect(() => {
    async function initDb() {
      const instance = await Sqlite.create();
      const currentTable = instance.tables[0];

      setFilters(null);
      setTables(instance.tables);
      setSchema(instance.schema);
      setCurrentTable(currentTable);
      setSqlite(instance);
    }
    initDb();
  }, []);

  // Update data when changes occur.
  useEffect(() => {
    if (!sqlite || !currentTable) return;
    const [data, maxSize] = sqlite.getTableData(currentTable, page, filters);
    setMaxSize(maxSize);
    setData(data);
  }, [sqlite, currentTable, page, filters]);

  // When user opens a file.
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

        setFilters(null); // Reset filters when a new file is selected.
        setData([]); // Reset data when a new file is selected.
        setTables(instance.tables);
        setSchema(instance.schema);
        setCurrentTable(currentTable);
        setMaxSize(1);
        setPage(1);
        setSqlite(instance);
      };
      reader.readAsArrayBuffer(file);
    },
    []
  );

  // When user executes a new SQL statement.
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
          const [data, maxSize] = sqlite.getTableData(
            currentTable as string,
            page
          );
          setMaxSize(maxSize);
          setData(data);
          // Update current table after executing a new SQL statement.
          // setCurrentTable(currentTable);
        }
      }
    }
  }, [query, sqlite, currentTable, page]);

  // When user changes the page.
  const handlePageChange = useCallback((type: "next" | "prev") => {
    if (type === "next") {
      setPage((prev) => prev + 1);
    } else {
      setPage((prev) => prev - 1);
    }
  }, []);

  // When user updates the filter.
  const handleQueryFilter = useCallback((column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  }, []);

  // When user changes the table.
  const handleTableChange = useCallback(
    (selectedTable: string) => {
      if (!sqlite) return;

      setFilters(null);
      setPage(1);
      setCurrentTable(selectedTable);
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
              <section key={column}>
                <span className="p-2">{column}</span>
                <input
                  type="text"
                  value={filters?.[column] || ""} // Set to an empty string when filters are null
                  onChange={(e) => handleQueryFilter(column, e.target.value)}
                />
              </section>
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
        <div>
          {filters ? (
            <div>
              <p>No data found for the current filters</p>
              <Button
                onClick={() => {
                  setFilters(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <p>No data found</p>
          )}
        </div>
      )}

      <p>
        Page: {page} of {maxSize}
      </p>
      <Button
        onClick={() => handlePageChange("next")}
        disabled={page >= maxSize}
      >
        Next
      </Button>
      <Button onClick={() => handlePageChange("prev")} disabled={page === 1}>
        Prev
      </Button>
    </div>
  );
}
