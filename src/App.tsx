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
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { IndexSchema, TableSchema } from "@/types";
import type { SqlValue } from "sql.js";
import { ColumnIcon } from "./components/ColumnIcon";
import {
  ArrowDownNarrowWideIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
} from "lucide-react";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [data, setData] = useState<SqlValue[][] | null>(null);
  const [columns, setColumns] = useState<string[] | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [filters, setFilters] = useState<Record<string, string> | null>(null);
  const [sorters, setSorters] = useState<Record<string, "asc" | "desc"> | null>(
    null
  );

  const [tablesSchema, setTablesSchema] = useState<TableSchema>({});
  const [indexesSchema, setIndexesSchema] = useState<IndexSchema[]>([]);
  const [currentTable, setCurrentTable] = useState<string | null>(null);

  const [maxSize, setMaxSize] = useState<number>(1);
  const [page, setPage] = useState(1);

  const [selectedRow, setSelectedRow] = useState<{
    data: SqlValue[];
    index: number;
  } | null>();

  const workerRef = useRef<Worker | null>(null);

  // Initialize worker and send initial "init" message
  useEffect(() => {
    // Create a new worker
    workerRef.current = new Worker(new URL("./sqlWorker.ts", import.meta.url), {
      type: "module",
    });
    // Listen for messages from the worker
    workerRef.current.onmessage = (event) => {
      const { action, payload } = event.data;
      // When the worker is initialized
      if (action === "initComplete") {
        setTablesSchema(payload.tableSchema);
        setIndexesSchema(payload.indexSchema);
        setCurrentTable(payload.currentTable);
        // Reset
        setFilters(null);
        setSorters(null);
        setSelectedRow(null);
        setPage(1);
        setIsDatabaseLoading(false);
      } // When the query is executed and returns results
      else if (action === "queryComplete") {
        if (payload.maxSize !== undefined) setMaxSize(payload.maxSize);
        const data = payload.results?.[0]?.values || [];
        // To be able to cache the columns
        if (data.length !== 0) {
          setData(payload.results?.[0]?.values || []);
          setColumns(payload.results?.[0]?.columns || []);
        } else {
          setData(null);
        }
        setIsDataLoading(false);
        setErrorMessage(null);
      } // When the database is updated and requires a new schema
      else if (action === "updateInstance") {
        setTablesSchema(payload.tableSchema);
        setIndexesSchema(payload.indexSchema);
        setIsDataLoading(false);
      } // When the database is downloaded
      else if (action === "downloadComplete") {
        const blob = new Blob([payload.bytes], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "database.sqlite";
        link.click();
      } // When the worker encounters an error
      else if (action === "queryError") {
        console.error("Worker error:", payload.error);
        setErrorMessage(payload.error.message);
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

  // Handle SQL statement execution by sending it to the worker
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

  // Handles when user changes the page
  const handlePageChange = useCallback(
    (type: "next" | "prev" | "first" | "last" | number) => {
      setSelectedRow(null);
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

  // Handle when user updates the filter
  // Filters the data by searching for a value in a column using LIKE
  const handleQueryFilter = useCallback((column: string, value: string) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
    // Reset to first page when filtering
    setPage(1);
    setSelectedRow(null);
  }, []);

  // Handle when user updates the sorter
  // Sorts the data order by the selected column
  const handleQuerySorter = useCallback((column: string) => {
    setSorters((prev) => ({
      ...prev,
      [column]: prev?.[column] === "asc" ? "desc" : "asc",
    }));
    setSelectedRow(null);
  }, []);

  // Handle when user changes the table
  const handleTableChange = useCallback((selectedTable: string) => {
    setFilters(null);
    setSorters(null);
    setPage(1);
    setSelectedRow(null);
    setCurrentTable(selectedTable);
  }, []);

  // Handle when user downloads the database
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
          {Object.keys(tablesSchema).map((table) => (
            <SelectItem key={table} value={table}>
              <span className="capitalize">{table}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    [tablesSchema, currentTable, handleTableChange]
  );

  const sorterButton = useCallback(
    (column: string) => (
      <>
        {sorters?.[column] ? (
          sorters?.[column] === "asc" ? (
            <button
              title="Descending"
              type="button"
              aria-label="Sort Descending"
              disabled={isDataLoading}
              onClick={() => handleQuerySorter(column)}
            >
              <ArrowDownNarrowWideIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              title="Ascending"
              type="button"
              aria-label="Sort Ascending"
              disabled={isDataLoading}
              onClick={() => handleQuerySorter(column)}
            >
              <ArrowUpNarrowWideIcon className="h-4 w-4" />
            </button>
          )
        ) : (
          <button
            title="Sort column"
            type="button"
            aria-label="Sort Column"
            disabled={isDataLoading}
            onClick={() => handleQuerySorter(column)}
          >
            <ArrowUpDownIcon className="h-4 w-4" />
          </button>
        )}
      </>
    ),
    [sorters, handleQuerySorter, isDataLoading]
  );

  const paginationControls = useMemo(
    () => (
      <section className="flex items-center gap-2">
        <Button
          onClick={() => handlePageChange("first")}
          disabled={page === 1 || isDataLoading}
        >
          First
        </Button>
        <Button
          onClick={() => handlePageChange("prev")}
          disabled={page === 1 || isDataLoading}
        >
          Prev
        </Button>
        <span>
          Page: {page} of {maxSize}
        </span>
        <Button
          onClick={() => handlePageChange("next")}
          disabled={page >= maxSize || isDataLoading}
        >
          Next
        </Button>
        <Button
          onClick={() => handlePageChange("last")}
          disabled={page === maxSize || isDataLoading}
        >
          Last
        </Button>
        {/* TODO: Add a state for the input */}
        <Input
          className="w-36"
          type="number"
          defaultValue={page}
          disabled={isDataLoading}
          min={1}
          max={maxSize}
          onBlur={(e) => {
            const page = Number.parseInt(e.target.value);
            if (page > 0 && page <= maxSize) handlePageChange(page);
          }}
        />
      </section>
    ),
    [page, maxSize, handlePageChange, isDataLoading]
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
          {Object.entries(tablesSchema).map(([tableName, tableData]) => (
            <div key={tableName} className="flex flex-col gap-2">
              <h3 className="text-lg font-bold">{tableName}</h3>
              <span>{tableData.sql}</span>
              <ul>
                {Object.entries(tableData.schema).map(([index, column]) => (
                  <li key={index} className="flex gap-2 items-center">
                    <span className="text-sm">
                      {column.name}, {column.type}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {indexesSchema.map((index) => (
            <div key={index.name} className="flex flex-col gap-2">
              <h3 className="text-lg font-bold">{index.name}</h3>
              <span>{index.sql}</span>
              <span>{index.tableName}</span>
            </div>
          ))}
        </section>
      </>
    ),
    [tablesSchema, indexesSchema]
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
            <Button onClick={() => setFilters(null)} disabled={filters == null}>
              Clear Filters
            </Button>
            <Button onClick={() => setSorters(null)} disabled={sorters == null}>
              Reset Order
            </Button>
            <Button>Export</Button>
            <Button>Print Data</Button>
            <Button>Insert Row</Button>
            <Button>Update the current row</Button>
            <Button>Delete the current row</Button>
          </div>
        </section>

        <p>{isDataLoading ? "Data Loading..." : "Idle"}</p>
        <p>{isDatabaseLoading ? "Database Loading..." : "Idle"}</p>
        <p>{JSON.stringify(selectedRow)}</p>
        <p>{errorMessage}</p>
        <Table>
          <TableHeader>
            <TableRow>
              {columns && currentTable ? (
                columns.map((column, index) => (
                  <TableHead key={column}>
                    <div className="flex items-center gap-1">
                      <ColumnIcon
                        columnSchema={tablesSchema[currentTable].schema[index]}
                      />
                      <span className="capitalize font-bold">{column}</span>
                      {sorterButton(column)}
                    </div>
                    <FilterInput
                      column={column}
                      value={filters?.[column] || ""}
                      onChange={handleQueryFilter}
                    />
                    {JSON.stringify(tablesSchema[currentTable].schema[index])}
                  </TableHead>
                ))
              ) : (
                <p>No columns found</p>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data ? (
              data?.map((row, i) => (
                <TableRow
                  key={i}
                  onClick={() => setSelectedRow({ data: row, index: i })}
                  className={selectedRow?.index === i ? "bg-blue-100" : ""}
                >
                  {row.map((value, j) => (
                    <TableCell key={j}>
                      {value ?? (
                        <span className="text-muted-foreground">NULL</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <div>
                {filters ? (
                  <div>
                    <p>No data found for the current filters</p>
                    <Button onClick={() => setFilters(null)}>
                      Clear filters
                    </Button>
                  </div>
                ) : (
                  // When table is empty
                  <p>No data found</p>
                )}
              </div>
            )}
          </TableBody>
        </Table>

        {paginationControls}
      </>
    ),
    [
      TableSelector,
      data,
      filters,
      sorters,
      handleQueryFilter,
      selectedRow,
      paginationControls,
      isDataLoading,
      isDatabaseLoading,
      sorterButton,
      columns,
      currentTable,
      tablesSchema,
      errorMessage,
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
        <TabsContent value="data">
          {isDatabaseLoading ? <p>loading</p> : dataTab}
        </TabsContent>
        <TabsContent value="structure">{schemaTab}</TabsContent>
        <TabsContent value="execute">{executeTab}</TabsContent>
      </Tabs>
    </main>
  );
}
