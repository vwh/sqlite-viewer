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
  PlusIcon,
  DatabaseIcon,
  LoaderCircleIcon,
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
        className="border border-primary/20 rounded px-2 py-1 max-h-6 w-full text-[0.8rem]!"
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
  const [isInserting, setIsInserting] = useState(false);

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
        setIsInserting(false);
        setPage(1);
        setIsDatabaseLoading(false);
      } // When the query is executed and returns results
      else if (action === "queryComplete") {
        if (payload.maxSize !== undefined) setMaxSize(payload.maxSize);
        const data = payload.results?.[0]?.values || [];
        // put the first as initial value on EditValues used for insert form
        setEditValues(payload.results?.[0]?.values?.[0] || []);
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
      } else if (action === "insertComplete") {
        setIsInserting(false);
        // TODO Toast notification
        console.log("Insert complete");
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
    setIsInserting(false);
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
      // Reset the selected row
      setSelectedRow(null);
      setIsInserting(false);
    },
    [currentTable, columns, editValues, selectedRow, page, filters, sorters]
  );

  const TableSelector = useMemo(
    () => (
      <Select
        onValueChange={handleTableChange}
        value={currentTable || undefined}
      >
        <SelectTrigger className="w-48 h-8 text-sm">
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
              className="p-1 hover:bg-primary/10 rounded"
            >
              <ArrowDownNarrowWideIcon className="h-3 w-3" />
            </button>
          ) : (
            <button
              title="Sort column in ascending order"
              type="button"
              aria-label="Sort Ascending"
              disabled={isDataLoading}
              onClick={() => handleQuerySorter(column)}
              className="p-1 hover:bg-primary/10 rounded"
            >
              <ArrowUpNarrowWideIcon className="h-3 w-3" />
            </button>
          )
        ) : (
          <button
            title="Sort column in ascending order"
            type="button"
            aria-label="Sort Column"
            disabled={isDataLoading}
            onClick={() => handleQuerySorter(column)}
            className="p-1 hover:bg-primary/10 rounded"
          >
            <ArrowUpDownIcon className="h-3 w-3" />
          </button>
        )}
      </>
    ),
    [sorters, handleQuerySorter, isDataLoading]
  );

  const paginationControls = useMemo(
    () => (
      <div className="flex items-center justify-between bg-primary/5 p-2 border-t">
        <div className="flex items-center gap-1">
          <Button
            onClick={() => handlePageChange("first")}
            disabled={page === 1 || isDataLoading}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            title="Go to the first page"
          >
            <ChevronFirstIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handlePageChange("prev")}
            disabled={page === 1 || isDataLoading}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            title="Go to the previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-xs px-2">
            Page: {page} of {maxSize}
          </span>
          <Button
            onClick={() => handlePageChange("next")}
            disabled={page >= maxSize || isDataLoading}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            title="Go to the next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handlePageChange("last")}
            disabled={page === maxSize || isDataLoading}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            title="Go to the last page"
          >
            <ChevronLastIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => setIsInserting(true)}
            disabled={isInserting}
          >
            <PlusIcon className="h-3 w-3 mr-1" />
            Insert row
          </Button>
          <Button
            onClick={() => handleExport("current")}
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            title="Export current data as CSV"
          >
            <FolderOutputIcon className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>
    ),
    [page, maxSize, handlePageChange, isDataLoading, handleExport, isInserting]
  );

  const schemaSection = useMemo(
    () => (
      <div className="h-full overflow-y-auto border ">
        <DBSchemaTree
          tablesSchema={tablesSchema}
          indexesSchema={indexesSchema}
        />
      </div>
    ),
    [tablesSchema, indexesSchema]
  );

  const schemaTab = useMemo(
    () => (
      <div className="flex flex-col h-full ">
        <div className="flex items-center gap-1 p-2 border-b ">
          <Button size="sm" variant="outline" className="text-xs">
            Create Table
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            Create Index
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            Print Schema
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">{schemaSection}</div>
      </div>
    ),
    [schemaSection]
  );

  const editSection = useMemo(
    () => (
      <div className="h-full border overflow-auto">
        {!isInserting ? (
          <div>
            {selectedRow && (
              <div className="flex flex-col w-full h-full">
                <div className="overflow-auto flex-1">
                  <Table className="border">
                    <TableHeader>
                      <TableRow className="bg-primary/5">
                        {columns!.map((column, index) => (
                          <TableHead key={column} className="p-1 text-xs">
                            <div className="flex items-center gap-1">
                              <ColumnIcon
                                columnSchema={
                                  tablesSchema[currentTable!].schema[index]
                                }
                              />
                              <span className="capitalize font-medium">
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
                          <TableCell key={i} className="p-1">
                            <Input
                              name={columns![i]}
                              className="h-7 text-xs"
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
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs grow-2 rounded-none"
                    onClick={() => handleEditSubmit("update")}
                  >
                    Apply changes
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs grow rounded-none"
                    onClick={() => handleEditSubmit("delete")}
                  >
                    Delete row
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full h-full">
            <div className="overflow-auto flex-1">
              <Table className="border">
                <TableHeader>
                  <TableRow className="bg-primary/5">
                    {columns!.map((column, index) => (
                      <TableHead key={column} className="p-1 text-xs">
                        <div className="flex items-center gap-1">
                          <ColumnIcon
                            columnSchema={
                              tablesSchema[currentTable!].schema[index]
                            }
                          />
                          <span className="capitalize font-medium">
                            {column}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {editValues
                      ? editValues.map((value, i) => (
                          <TableCell key={i} className="p-1">
                            <Input
                              name={columns![i]}
                              className="h-7 text-xs"
                              placeholder={value}
                              onChange={(e) =>
                                handlEditInputChange(i, e.target.value)
                              }
                            />
                          </TableCell>
                        ))
                      : // If the table is empty, fill it with empty values
                        columns!.map((column, index) => (
                          <TableCell key={column} className="p-1">
                            <Input
                              name={column}
                              className="h-7 text-xs"
                              onChange={(e) =>
                                handlEditInputChange(index, e.target.value)
                              }
                            />
                          </TableCell>
                        ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                className="text-xs grow-2 rounded-none"
                onClick={() => handleEditSubmit("insert")}
              >
                <PlusIcon className="h-3 w-3" />
                Insert row
              </Button>
            </div>
          </div>
        )}
      </div>
    ),
    [
      currentTable,
      selectedRow,
      tablesSchema,
      columns,
      editValues,
      handlEditInputChange,
      handleEditSubmit,
      isInserting,
    ]
  );

  const executeTab = useMemo(
    () => (
      <div className="flex flex-col h-full ">
        <div className="flex items-center gap-1 p-2 border-b ">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={handleQueryExecute}
            title="Execute SQL"
          >
            <PlayIcon className="h-3 w-3 mr-1" />
            Execute SQL
          </Button>
        </div>

        <div className="p-2 flex-1">
          <textarea
            className="w-full h-full min-h-64 p-2 border rounded font-mono text-sm resize-none"
            placeholder="Enter SQL"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {errorMessage && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    ),
    [query, handleQueryExecute, errorMessage]
  );

  const dataTable = useMemo(
    () => (
      <Table className="border rounded">
        <TableHeader>
          <TableRow className="bg-primary/5">
            {columns && currentTable ? (
              columns.map((column, index) => (
                <TableHead key={column} className="p-1 text-xs">
                  <div className="flex items-center gap-1">
                    <ColumnIcon
                      columnSchema={tablesSchema[currentTable].schema[index]}
                    />
                    <span className="capitalize font-medium text-foreground">
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
                <p className="text-xs">No columns found</p>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, i) => (
              <TableRow
                key={i}
                onClick={() => {
                  setSelectedRow({ data: row, index: i });
                  setIsInserting(false);
                }}
                className={`cursor-pointer hover:bg-primary/5 text-xs ${
                  selectedRow?.index === i ? "bg-primary/10" : ""
                }`}
              >
                {row.map((value, j) => (
                  <TableCell key={j} className="p-2">
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
                      <p className="text-sm">
                        No data found for the current filters
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setFilters(null)}
                      >
                        Clear filters
                      </Button>
                    </>
                  ) : (
                    <p className="text-sm">
                      No data found in the current table
                    </p>
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
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-1 p-2 border-b ">
          {TableSelector}
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => setFilters(null)}
            disabled={filters == null}
            title="Clear applied filters"
          >
            <FilterXIcon className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => setSorters(null)}
            disabled={sorters == null}
            title="Reset sorting"
          >
            <ListRestartIcon className="h-3 w-3 mr-1" />
            Reset sorting
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => handleExport("table")}
            title="Export the current table as CSV"
          >
            <FolderOutputIcon className="h-3 w-3 mr-1" />
            Export table
          </Button>
          {(isDataLoading || isDatabaseLoading) && (
            <span className="text-xs ml-2 text-gray-500 flex items-center">
              <LoaderCircleIcon className="h-3 w-3 mr-1 animate-spin" />
              Loading data
            </span>
          )}
        </div>

        <div className="overflow-hidden h-full">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-md"
          >
            {/* Left Panel - Data Table */}
            <ResizablePanel defaultSize={75} minSize={25}>
              <div className="flex flex-col h-full justify-between">
                {dataTable}
                {paginationControls}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Split Vertically */}
            <ResizablePanel defaultSize={25} minSize={15}>
              <ResizablePanelGroup direction="vertical">
                {/* Top Panel - Edit Section */}
                <ResizablePanel
                  defaultSize={15}
                  minSize={15}
                  maxSize={15}
                  className={`${selectedRow || isInserting ? "" : "hidden"}`}
                >
                  {editSection}
                </ResizablePanel>
                <ResizableHandle
                  className={`${selectedRow || isInserting ? "" : "hidden"}`}
                  withHandle
                />
                {/* Bottom Panel - Schema */}
                <ResizablePanel defaultSize={60}>
                  <div className="h-full overflow-hidden">{schemaSection}</div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    ),
    [
      TableSelector,
      dataTable,
      filters,
      sorters,
      paginationControls,
      selectedRow,
      isDataLoading,
      isDatabaseLoading,
      schemaSection,
      editSection,
      handleExport,
    ]
  );

  const topBar = useMemo(
    () => (
      <div className="flex items-center gap-1 p-2 border-b ">
        <div className="relative">
          <Input
            type="file"
            className="cursor-pointer opacity-0 absolute top-0 left-0 w-full h-full"
            onChange={handleFileChange}
          />
          <Button size="sm" variant="outline" className="text-xs">
            <DatabaseIcon className="h-3 w-3" />
            Open Database
          </Button>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={handleDownload}
          title="Save the database"
        >
          <SaveIcon className="h-3 w-3" />
          Save Database
        </Button>
      </div>
    ),
    [handleFileChange, handleDownload]
  );

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {topBar}

      <Tabs defaultValue="data" className="flex-1 flex flex-col">
        <TabsList className="mt-2 justify-start border-b rounded-none bg-transparent h-9">
          <TabsTrigger
            value="structure"
            className="text-xs h-8 data-[state=active]: data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Database Structure
          </TabsTrigger>
          <TabsTrigger
            value="data"
            className="text-xs h-8 data-[state=active]: data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Browse Data
          </TabsTrigger>
          <TabsTrigger
            value="execute"
            className="text-xs h-8 data-[state=active]: data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Execute SQL
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 max-h-[calc(100vh-5.5rem)] overflow-hidden">
          <TabsContent value="data" className="h-full m-0 p-0 border-none">
            {isDatabaseLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin" />
                <span>Loading database</span>
              </div>
            ) : (
              dataTab
            )}
          </TabsContent>
          <TabsContent value="structure" className="h-full m-0 p-0 border-none">
            {schemaTab}
          </TabsContent>
          <TabsContent value="execute" className="h-full m-0 p-0 border-none">
            {executeTab}
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
