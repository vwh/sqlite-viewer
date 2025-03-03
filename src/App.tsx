import { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Schema } from "@/types";
import type { QueryExecResult } from "sql.js";

const FilterInput = memo(
  ({
    column,
    value,
    onChange,
  }: {
    column: string;
    value: string;
    onChange: (column: string, value: string) => void;
  }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(column, e.target.value),
      [column, onChange]
    );

    return (
      <Input
        type="text"
        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
        value={value}
        onChange={handleChange}
        placeholder="Filter"
      />
    );
  }
);

export default function App() {
  const [isDatabaseLoading, setIsDatabaseLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [isUserCustomQuery, setIsUserCustomQuery] = useState(false);

  const [data, setData] = useState<QueryExecResult[] | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [filters, setFilters] = useState<Record<string, string> | null>(null);
  const [sorters, setSorters] = useState<Record<string, "asc" | "desc"> | null>(
    null
  );

  const [schema, setSchema] = useState<Schema>(new Map());

  const [tables, setTables] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<string | null>(null);

  const [maxSize, setMaxSize] = useState<number>(1);
  const [page, setPage] = useState(1);

  const workerRef = useRef<Worker | null>(null);

  // Initialize worker and send initial "init" message
  useEffect(() => {
    // Create a new worker
    workerRef.current = new Worker(new URL("./sqlWorker.ts", import.meta.url), {
      type: "module",
    });

    workerRef.current.onmessage = (event) => {
      const { action, payload } = event.data;
      if (action === "initComplete") {
        setTables(payload.tables);
        setSchema(new Map(payload.schema));
        setCurrentTable(payload.currentTable);
        // Reset
        setFilters(null);
        setSorters(null);
        setPage(1);
        setIsDatabaseLoading(false);
      } else if (action === "queryComplete") {
        if (payload.maxSize !== undefined) setMaxSize(payload.maxSize);
        setData(payload.results);
        setIsDataLoading(false);
      } else if (action === "updateInstance") {
        setTables(payload.tables);
        setSchema(new Map(payload.schema));
        setIsDataLoading(false);
      } else if (action === "downloadComplete") {
        const blob = new Blob([payload.bytes], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "database.sqlite";
        link.click();
      } else if (action === "queryError") {
        console.error("Worker error:", payload.error);
        setIsDataLoading(false);
      }
    };

    setIsDatabaseLoading(true);
    // Start with a new database instance
    workerRef.current.postMessage({ action: "init" });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // When fetching data, ask the worker for new data
  useEffect(() => {
    if (!currentTable) return;
    // Debounce to prevent too many requests when filters change rapidly
    const handler = setTimeout(() => {
      setIsDataLoading(true);
      workerRef.current?.postMessage({
        action: "getTableData",
        payload: { currentTable, page, filters, sorters },
      });
    }, 100);

    return () => clearTimeout(handler);
  }, [currentTable, page, filters, sorters]);

  // Handle file upload by sending the file to the worker
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        setIsDatabaseLoading(true);
        const arrayBuffer = e.target?.result as ArrayBuffer;
        workerRef.current?.postMessage({
          action: "openFile",
          payload: { file: arrayBuffer },
        });
      };
      reader.readAsArrayBuffer(file);
    },
    []
  );

  // Execute a SQL statement by sending it to the worker
  const handleQueryExecute = useCallback(() => {
    // Remove SQL comments before processing
    const cleanedQuery = query
      .replace(/--.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");
    // Split the query into multiple statements
    const statements = cleanedQuery
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt !== "");
    for (const stmt of statements) {
      setIsDataLoading(true);
      workerRef.current?.postMessage({
        action: "exec",
        payload: { query: stmt, currentTable, page, filters, sorters },
      });
    }
  }, [query, currentTable, page, filters, sorters]);

  // When user changes the page
  const handlePageChange = useCallback(
    (type: "next" | "prev" | "first" | "last" | number) => {
      setPage((prev) => {
        if (type === "next") return prev + 1;
        if (type === "prev") return prev - 1;
        if (type === "first") return 1;
        if (type === "last") return maxSize;
        if (typeof type === "number") return type;
        return prev;
      });
    },
    [maxSize]
  );

  // When user updates the filter
  const handleQueryFilter = useCallback((column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    // Reset to first page when filtering
    setPage(1);
  }, []);

  // When user updates the sorter
  const handleQuerySorter = useCallback((column: string) => {
    setSorters((prev) => ({
      ...prev,
      [column]: prev?.[column] === "asc" ? "desc" : "asc",
    }));
  }, []);

  // When user changes the table
  const handleTableChange = useCallback((selectedTable: string) => {
    setFilters(null);
    setSorters(null);
    setPage(1);
    setCurrentTable(selectedTable);
  }, []);

  // When user downloads the database
  const handleDownload = useCallback(() => {
    workerRef.current?.postMessage({ action: "download" });
  }, []);

  const TableSelector = useMemo(
    () => (
      <Select
        onValueChange={handleTableChange}
        value={currentTable || undefined}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Table" />
        </SelectTrigger>
        <SelectContent>
          {tables.map((table) => (
            <SelectItem key={table} value={table}>
              {table}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    [tables, currentTable, handleTableChange]
  );

  const sorterButton = useCallback(
    (column: string) => (
      <Button onClick={() => handleQuerySorter(column)}>
        {sorters?.[column] === "asc" ? "▲" : "▼"}
      </Button>
    ),
    [sorters, handleQuerySorter]
  );

  const paginationControls = useMemo(
    () => (
      <section className="flex items-center gap-2">
        <Button onClick={() => handlePageChange("first")} disabled={page === 1}>
          First
        </Button>
        <Button onClick={() => handlePageChange("prev")} disabled={page === 1}>
          Prev
        </Button>
        <span>
          Page: {page} of {maxSize}
        </span>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={page >= maxSize}
        >
          Next
        </Button>
        <Button
          onClick={() => handlePageChange("last")}
          disabled={page === maxSize}
        >
          Last
        </Button>
        <span>
          Page: {page} of {maxSize}
        </span>
        {/* TODO: Add a state for the input */}
        <Input
          className="w-36"
          type="number"
          defaultValue={page}
          min={1}
          max={maxSize}
          onBlur={(e) => {
            const page = Number.parseInt(e.target.value);
            if (page > 0 && page <= maxSize) handlePageChange(page);
          }}
        />
      </section>
    ),
    [page, maxSize, handlePageChange]
  );

  const schemaTab = useMemo(
    () => (
      <>
        <section>
          <div className="flex items-center gap-2">
            <Button>Create Table</Button>
            <Button>Create Index</Button>
            <Button>Print Schema</Button>
          </div>
        </section>
        <section>
          {[...schema].map(([tableName, data]) => (
            <div key={tableName} className="flex flex-col gap-2">
              <h3 className="text-lg font-bold">{tableName}</h3>
              <ul>
                {Object.entries(data).map(([index, column]) => (
                  <li key={index} className="flex gap-2 items-center">
                    <span className="text-sm">
                      {column.name}, {column.type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </>
    ),
    [schema]
  );

  const executeTab = useMemo(
    () => (
      <>
        <section>
          <div className="flex items-center gap-2">
            <Button onClick={handleQueryExecute}>Execute SQL</Button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <textarea
            className="border p-2 rounded h-24"
            placeholder="Enter SQL"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </section>
      </>
    ),
    [query, handleQueryExecute]
  );

  const dataTab = useMemo(
    () => (
      <>
        <section>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span>Table:</span>
              {TableSelector}
            </div>
            <Button>Clear Filters</Button>
            <Button>Reset Order</Button>
            <Button>Export</Button>
            <Button>Print Data</Button>
            <Button>Insert Row</Button>
            <Button>Update the current row</Button>
            <Button>Delete the current row</Button>
          </div>
        </section>

        <p>{isDataLoading ? "Data Loading..." : "Idle"}</p>
        <p>{isDatabaseLoading ? "Database Loading..." : "Idle"}</p>
        {data?.[0] && "columns" in data[0] ? (
          <Table>
            <TableHeader>
              <TableRow>
                {data[0]?.columns.map((column) => (
                  <TableHead key={column}>
                    {column}
                    <div>
                      <FilterInput
                        column={column}
                        value={filters?.[column] || ""}
                        onChange={handleQueryFilter}
                      />
                    </div>
                    {sorterButton(column)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data[0]?.values.map((row, i) => (
                <TableRow key={i}>
                  {row.map((value, j) => (
                    <TableCell key={j}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={data[0]?.columns.length}>
                  {paginationControls}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <div>
            {filters ? (
              <div>
                <p>No data found for the current filters</p>
                <Button onClick={() => setFilters(null)}>Clear filters</Button>
              </div>
            ) : (
              // When table is empty
              <p>No data found</p>
            )}
          </div>
        )}
      </>
    ),
    [
      TableSelector,
      data,
      filters,
      handleQueryFilter,
      isDataLoading,
      isDatabaseLoading,
      paginationControls,
      sorterButton,
    ]
  );

  return (
    <main className="flex flex-col gap-4 p-4">
      <section className="flex gap-2">
        <Input
          type="file"
          className="cursor-pointer"
          onChange={handleFileChange}
        />
        <Button onClick={handleDownload}>Download Database</Button>
      </section>

      <Tabs defaultValue="structure">
        <TabsList>
          <TabsTrigger value="structure">Database Structure</TabsTrigger>
          <TabsTrigger value="data">Browse Data</TabsTrigger>
          <TabsTrigger value="execute">Execute SQL</TabsTrigger>
        </TabsList>
        <TabsContent value="data">{dataTab}</TabsContent>
        <TabsContent value="structure">{schemaTab}</TabsContent>
        <TabsContent value="execute">{executeTab}</TabsContent>
      </Tabs>
    </main>
  );
}
