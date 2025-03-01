import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

import type { Schema } from "@/types";
import type { QueryExecResult } from "sql.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [isUserCustomQuery, setIsUserCustomQuery] = useState(false);

  const [data, setData] = useState<QueryExecResult[] | null>(null);

  const [filters, setFilters] = useState<Record<string, string> | null>(null);

  const [schema, setSchema] = useState<Schema>(new Map());

  const [tables, setTables] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<string | null>(null);

  const [maxSize, setMaxSize] = useState<number>(1);
  const [page, setPage] = useState(1);

  const workerRef = useRef<Worker | null>(null);

  // Initialize worker and send initial "init" message.
  useEffect(() => {
    // Create a new worker.
    workerRef.current = new Worker(new URL("./sqlWorker.ts", import.meta.url), {
      type: "module",
    });

    workerRef.current.onmessage = (event) => {
      const { action, payload } = event.data;
      if (action === "initComplete") {
        // Update state with initial instance info.
        setTables(payload.tables);
        // Convert schema back to a Map if needed.
        setSchema(new Map(payload.schema));
        setCurrentTable(payload.currentTable);
      } else if (action === "queryComplete") {
        if (payload.maxSize !== undefined) setMaxSize(payload.maxSize);
        setData(payload.results);
      } else if (action === "updateInstance") {
        setTables(payload.tables);
        setSchema(new Map(payload.schema));
      } else if (action === "queryError") {
        console.error("Worker error:", payload.error);
      }
    };

    // Start with a new database instance.
    workerRef.current.postMessage({ action: "init" });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // When changing page or filters, ask the worker for new data.
  useEffect(() => {
    if (!currentTable) return;
    workerRef.current?.postMessage({
      action: "getTableData",
      payload: { currentTable, page, filters },
    });
  }, [currentTable, page, filters]);

  // Handle file upload by sending the file to the worker.
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        // Post file data to worker.
        workerRef.current?.postMessage({
          action: "openFile",
          payload: { file: arrayBuffer },
        });
        // Reset page and filters.
        setFilters(null);
        setPage(1);
      };
      reader.readAsArrayBuffer(file);
    },
    []
  );

  // Execute a SQL statement by sending it to the worker.
  const handleQueryExecute = useCallback(() => {
    // Remove SQL comments before processing.
    const cleanedQuery = query
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
    // Split the query into multiple statements.
    const statements = cleanedQuery
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt !== "");
    for (const stmt of statements) {
      workerRef.current?.postMessage({
        action: "exec",
        payload: { query: stmt },
      });
    }
  }, [query]);

  // When user changes the page.
  const handlePageChange = useCallback((type: "next" | "prev") => {
    setPage((prev) => (type === "next" ? prev + 1 : prev - 1));
  }, []);

  // When user updates the filter.
  const handleQueryFilter = useCallback((column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  }, []);

  // When user changes the table.
  const handleTableChange = useCallback((selectedTable: string) => {
    setFilters(null);
    setPage(1);
    setCurrentTable(selectedTable);
  }, []);

  const tableButtons = useMemo(
    () =>
      tables.map((table) => (
        <Button key={table} onClick={() => handleTableChange(table)}>
          {table}
        </Button>
      )),
    [tables, handleTableChange]
  );

  if (!currentTable) {
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
                  value={filters?.[column] || ""}
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
              <Button onClick={() => setFilters(null)}>Clear filters</Button>
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
