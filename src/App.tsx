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
  ChevronRightIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronFirstIcon,
  FilterXIcon,
  ListRestartIcon,
  SaveIcon,
  PlayIcon,
  FolderOutputIcon,
} from "lucide-react";
import DBSchemaTree from "./components/DBSchemaTree";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
        className="border border-primary/20 rounded px-2 py-1 max-h-7 w-full text-xs"
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

  const [editValues, setEditValues] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<{
    data: SqlValue[];
    index: number;
  } | null>(null);

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
      } else if (action === "updateComplete") {
        // TODO setIsUpdating(false);
        // TODO Toast notification
        console.log("Update complete");
      }
      // When the database is downloaded
      else if (action === "downloadComplete") {
        const blob = new Blob([payload.bytes], {
          type: "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "database.sqlite";
        link.click();
      } else if (action === "exportComplete") {
        // TODO setIsExporting(false);
        console.log(payload.results);
        const blob = new Blob([payload.results], {
          type: "text/csv",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "export.csv";
        link.click();
      }
      // When the worker encounters an error
      else if (action === "queryError") {
        console.error("Worker error:", payload.error);
        // TODO setErrorMessage(payload.error.message); on when we do user custom queries
        setErrorMessage(payload.error.message);
        setIsDataLoading(false);
      } else {
        console.warn("Unknown action:", action);
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

  // Update formValues when selectedRow changes
  useEffect(() => {
    if (selectedRow?.data) {
      setEditValues(
        selectedRow.data.map((value) => value?.toString() ?? "null")
      );
    }
  }, [selectedRow]);

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

  // Handle when user exports the data
  const handleExport = useCallback(
    (exportType: "table" | "all" | "current") => {
      console.log("Exporting", exportType);
      workerRef.current?.postMessage({
        action: "export",
        payload: {
          table: currentTable!,
          filters,
          sorters,
          page,
          exportType: exportType,
        },
      });
    },
    [currentTable, filters, sorters, page]
  );

  // Handle when user downloads the database
  const handleDownload = useCallback(() => {
    workerRef.current?.postMessage({ action: "download" });
  }, []);

  // Handle when user updates the edit inputs
  const handlEditInputChange = useCallback(
    (index: number, newValue: string) => {
      const newEditValues = [...editValues];
      newEditValues[index] = newValue;
      setEditValues(newEditValues);
    },
    [editValues]
  );

  // Handle when user submits the edit form
  const handleEditSubmit = useCallback(
    (type: "insert" | "update" | "delete") => {
      setIsDataLoading(true);
      workerRef.current?.postMessage({
        action: type,
        payload: {
          table: currentTable!,
          columns,
          values: editValues,
          whereValues: selectedRow?.data,
        },
      });
      // Refresh the data
      workerRef.current?.postMessage({
        action: "refresh",
        payload: {
          currentTable: currentTable!,
          page,
          filters,
          sorters,
        },
      });
    },
    [currentTable, columns, editValues, selectedRow, page, filters, sorters]
  );

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
              title="Sort column in descending order"
              type="button"
              aria-label="Sort Descending"
              disabled={isDataLoading}
              onClick={() => handleQuerySorter(column)}
            >
              <ArrowDownNarrowWideIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              title="Sort column in ascending order"
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
            title="Sort column in ascending order"
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
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            onClick={() => handlePageChange("first")}
            disabled={page === 1 || isDataLoading}
            size="icon"
            title="Go to the first page"
          >
            <ChevronFirstIcon className="h-6 w-6" />
          </Button>
          <Button
            onClick={() => handlePageChange("prev")}
            disabled={page === 1 || isDataLoading}
            size="icon"
            title="Go to the previous page"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
          <span className="px-2">
            Page: {page} of {maxSize}
          </span>
          <Button
            onClick={() => handlePageChange("next")}
            disabled={page >= maxSize || isDataLoading}
            size="icon"
            title="Go to the next page"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </Button>
          <Button
            onClick={() => handlePageChange("last")}
            disabled={page === maxSize || isDataLoading}
            size="icon"
            title="Go to the last page"
          >
            <ChevronLastIcon className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button>Insert new row</Button>
          <Button
            onClick={() => handleExport("current")}
            title="Export current data as CSV"
          >
            <FolderOutputIcon className="h-6 w-6" />
            Export current data
          </Button>
        </div>
      </section>
    ),
    [page, maxSize, handlePageChange, isDataLoading, handleExport]
  );

  const schemaSection = useMemo(
    () => (
      <section className="flex flex-col gap-2 h-full">
        <DBSchemaTree
          tablesSchema={tablesSchema}
          indexesSchema={indexesSchema}
        />
      </section>
    ),
    [tablesSchema, indexesSchema]
  );

  const schemaTab = useMemo(
    () => (
      <div className="flex flex-col gap-4 h-full">
        <section className="flex items-center gap-1">
          <Button>Create Table</Button>
          <Button>Create Index</Button>
          <Button>Print Schema</Button>
        </section>

        {schemaSection}
      </div>
    ),
    [schemaSection]
  );

  const editSection = useMemo(
    () => (
      <div className="flex flex-col gap-4 h-full items-center justify-center">
        {selectedRow?.data ? (
          <div className="flex flex-col gap-2 w-full items-center justify-between h-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10">
                  {columns!.map((column, index) => (
                    <TableHead key={column} className="p-2">
                      <div className="flex items-center gap-1 pb-1">
                        <ColumnIcon
                          columnSchema={
                            tablesSchema[currentTable!].schema[index]
                          }
                        />
                        <span className="capitalize font-bold text-foreground">
                          {column}
                        </span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {editValues.map((value, i) => (
                    <TableCell key={i}>
                      <Input
                        name={columns![i]}
                        className="border p-2 rounded"
                        value={value}
                        onChange={(e) =>
                          handlEditInputChange(i, e.target.value)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
            <div className="flex justify-end w-full flex-wrap">
              <Button
                className="rounded-none grow"
                onClick={() => handleEditSubmit("update")}
              >
                Apply Changes
              </Button>
              <Button
                className="rounded-none grow"
                variant="destructive"
                onClick={() => handleEditSubmit("delete")}
              >
                Delete This Row
              </Button>
            </div>
          </div>
        ) : (
          <p>Select a row to edit</p>
        )}
      </div>
    ),
    [
      selectedRow,
      currentTable,
      tablesSchema,
      columns,
      editValues,
      handlEditInputChange,
      handleEditSubmit,
    ]
  );

  const executeTab = useMemo(
    () => (
      <>
        <section className="flex items-center gap-1">
          <Button onClick={handleQueryExecute} size="icon" title="Execute SQL">
            <PlayIcon className="h-6 w-6" />
          </Button>
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

  const dataTable = useMemo(
    () => (
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/10">
            {columns && currentTable ? (
              columns.map((column, index) => (
                <TableHead key={column} className="p-2">
                  <div className="flex items-center gap-1 pb-1">
                    <ColumnIcon
                      columnSchema={tablesSchema[currentTable].schema[index]}
                    />
                    <span className="capitalize font-bold text-foreground">
                      {column}
                    </span>
                    {sorterButton(column)}
                  </div>
                  <FilterInput
                    column={column}
                    value={filters?.[column] || ""}
                    onChange={handleQueryFilter}
                  />
                </TableHead>
              ))
            ) : (
              <TableHead>
                <p>No columns found</p>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, i) => (
              <TableRow
                key={i}
                onClick={() => setSelectedRow({ data: row, index: i })}
                className={selectedRow?.index === i ? "bg-primary/10" : ""}
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
            <TableRow>
              <TableCell
                colSpan={columns?.length || 1}
                className="h-32 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  {filters ? (
                    <>
                      <p>No data found for the current filters</p>
                      <Button onClick={() => setFilters(null)}>
                        Clear filters
                      </Button>
                    </>
                  ) : (
                    <p>No data found in the current table</p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    ),
    [
      data,
      filters,
      handleQueryFilter,
      selectedRow,
      sorterButton,
      columns,
      currentTable,
      tablesSchema,
    ]
  );

  const dataTab = useMemo(
    () => (
      <>
        <section className="flex items-center gap-1">
          <div className="flex items-center gap-2">
            <span>Table:</span>
            {TableSelector}
          </div>
          <Button
            onClick={() => setFilters(null)}
            disabled={filters == null}
            title="Clear applied filters"
          >
            <FilterXIcon className="h-6 w-6" />
            Clear filters
          </Button>
          <Button
            onClick={() => setSorters(null)}
            disabled={sorters == null}
            title="Reset sorting"
          >
            <ListRestartIcon className="h-6 w-6" />
            Reset sorting
          </Button>
          {/* TODO: maybe memo this button later on */}
          <Button
            onClick={() => handleExport("table")}
            title="Export the current table as CSV"
          >
            <FolderOutputIcon className="h-6 w-6" />
            Export table
          </Button>
        </section>

        <p>{isDataLoading ? "Data Loading..." : "Idle"}</p>
        <p>{isDatabaseLoading ? "Database Loading..." : "Idle"}</p>

        <ResizablePanelGroup
          direction="horizontal"
          className="rounded-lg border h-screen overflow-auto min-h-[calc(100vh-15rem)]"
        >
          {/* Left Panel */}
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full flex-col">
              <div className="flex-1 max-h-[620px] overflow-auto">
                {dataTable}
              </div>
              <div className="p-2 border-t">{paginationControls}</div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />
          {/* Right Panel */}
          <ResizablePanel defaultSize={20}>
            <ResizablePanelGroup direction="vertical">
              {/* Top Panel */}
              <ResizablePanel defaultSize={20}>
                <div className="flex-1 overflow-auto h-full">{editSection}</div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Bottom Panel */}
              <ResizablePanel defaultSize={75}>
                <div className="flex-1 overflow-auto h-full">
                  {schemaSection}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </>
    ),
    [
      TableSelector,
      dataTable,
      filters,
      sorters,
      paginationControls,
      isDataLoading,
      isDatabaseLoading,
      schemaSection,
      editSection,
      handleExport,
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
        <Button onClick={handleDownload} size="icon" title="Save the database">
          <SaveIcon className="h-6 w-6" />
        </Button>
      </section>

      <Tabs defaultValue="structure">
        <TabsList className="w-full">
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
