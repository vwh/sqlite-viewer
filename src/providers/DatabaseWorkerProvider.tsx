import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState
} from "react";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { usePanelStore } from "@/store/usePanelStore";
import { usePanelManager } from "./PanelProvider";

import { toast } from "sonner";

import type { Sorters } from "@/types";

interface DatabaseWorkerContextProps {
  workerRef: React.MutableRefObject<Worker | null>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  handleTableChange: (selectedTable: string) => void;
  handleQueryFilter: (column: string, value: string) => void;
  handleQuerySorter: (column: string) => void;
  handlePageChange: (type: "next" | "prev" | "first" | "last" | number) => void;
  handleExport: (exportType: "table" | "current") => void;
  handleQueryExecute: () => void;
  handleEditSubmit: (type: "insert" | "update" | "delete") => void;
}

const DatabaseWorkerContext = createContext<
  DatabaseWorkerContextProps | undefined
>(undefined);

interface DatabaseWorkerProviderProps {
  children: React.ReactNode;
}

export const DatabaseWorkerProvider = ({
  children
}: DatabaseWorkerProviderProps) => {
  const workerRef = useRef<Worker | null>(null);

  // Database Store
  const setTablesSchema = useDatabaseStore((state) => state.setTablesSchema);
  const setIndexesSchema = useDatabaseStore((state) => state.setIndexesSchema);
  const setCurrentTable = useDatabaseStore((state) => state.setCurrentTable);
  const setData = useDatabaseStore((state) => state.setData);
  const setColumns = useDatabaseStore((state) => state.setColumns);
  const setMaxSize = useDatabaseStore((state) => state.setMaxSize);
  const setIsDatabaseLoading = useDatabaseStore(
    (state) => state.setIsDatabaseLoading
  );
  const setIsDataLoading = useDatabaseStore((state) => state.setIsDataLoading);
  const setErrorMessage = useDatabaseStore((state) => state.setErrorMessage);
  const filters = useDatabaseStore((state) => state.filters);
  const sorters = useDatabaseStore((state) => state.sorters);
  const limit = useDatabaseStore((state) => state.limit);
  const offset = useDatabaseStore((state) => state.offset);
  const currentTable = useDatabaseStore((state) => state.currentTable);
  const maxSize = useDatabaseStore((state) => state.maxSize);
  const setOffset = useDatabaseStore((state) => state.setOffset);
  const setFilters = useDatabaseStore((state) => state.setFilters);
  const setSorters = useDatabaseStore((state) => state.setSorters);
  const setLimit = useDatabaseStore((state) => state.setLimit);
  const resetPagination = useDatabaseStore((state) => state.resetPagination);
  const setCustomQueryObject = useDatabaseStore(
    (state) => state.setCustomQueryObject
  );
  const customQuery = useDatabaseStore((state) => state.customQuery);
  const tablesSchema = useDatabaseStore((state) => state.tablesSchema);

  const resetEditSection = usePanelStore((state) => state.resetEditSection);

  const {
    selectedRowObject,
    setSelectedRowObject,
    setIsInserting,
    handleCloseEdit
  } = usePanelManager();

  const [isFirstTimeLoading, setIsFirstTimeLoading] = useState(true);

  // Initialize worker and send initial "init" message
  useEffect(() => {
    // Create a new worker
    workerRef.current = new Worker(
      new URL("./../lib/sqlite/sqliteWorker.ts", import.meta.url),
      { type: "module" }
    );

    // Listen for messages from the worker
    workerRef.current.onmessage = (event) => {
      const { action, payload } = event.data;

      // When the worker is initialized
      if (action === "initComplete") {
        setTablesSchema(payload.tableSchema);
        setIndexesSchema(payload.indexSchema);
        setCurrentTable(payload.currentTable);
        setColumns(
          payload.tableSchema[payload.currentTable]?.schema?.map(
            (column: { name: string }) => column.name
          )
        );
        setFilters(null);
        setSorters(null);
        setSelectedRowObject(null);
        setIsInserting(false);
        setIsDatabaseLoading(false);
      }
      // When the query is executed and returns results
      else if (action === "queryComplete") {
        setMaxSize(payload.maxSize);
        const data = payload.results?.[0]?.values || [];

        // To be able to cache the columns
        if (data.length !== 0) {
          setData(payload.results?.[0]?.values || []);
        } else {
          setData(null);
        }
        setIsDataLoading(false);
      }
      // When the custom query is executed and returns results
      else if (action === "customQueryComplete") {
        const data = payload.results?.[0]?.values || [];
        if (data.length !== 0) {
          setCustomQueryObject({
            data: payload.results?.[0]?.values || [],
            columns: payload.results?.[0]?.columns || []
          });
        } else {
          setCustomQueryObject(null);
        }
        setIsDataLoading(false);
        setErrorMessage(null);
      }
      // When the database is updated and requires a new schema
      else if (action === "updateInstance") {
        setTablesSchema(payload.tableSchema);
        setIndexesSchema(payload.indexSchema);
        setIsDataLoading(false);
        setErrorMessage(null);

        toast.success("Database schema updated successfully");
      } else if (action === "updateComplete") {
        setErrorMessage(null);
        resetEditSection();
        handleCloseEdit();
        toast.success(`Row ${payload.type} successfully`);
      } else if (action === "insertComplete") {
        setErrorMessage(null);
        resetEditSection();
        handleCloseEdit();
        toast.success("Row inserted successfully");
      }
      // When the database is downloaded
      else if (action === "downloadComplete") {
        const blob = new Blob([payload.bytes], {
          type: "application/octet-stream"
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "database.sqlite";
        link.click();
      } else if (action === "exportComplete") {
        const blob = new Blob([payload.results], {
          type: "text/csv"
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
        if (payload.error.isCustomQueryError) {
          setErrorMessage(payload.error.message);
        } else {
          toast.error(payload.error.message);
        }
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
  }, [
    setColumns,
    setIsDatabaseLoading,
    setTablesSchema,
    setCurrentTable,
    setIndexesSchema,
    setCustomQueryObject,
    setData,
    setMaxSize,
    setIsDataLoading,
    setErrorMessage,
    setFilters,
    setSorters,
    resetEditSection,
    setSelectedRowObject,
    handleCloseEdit,
    setIsInserting
  ]);

  // When fetching data, ask the worker for new data
  useEffect(() => {
    if (!currentTable) return;
    // Debounce to prevent too many requests when filters change rapidly
    const handler = setTimeout(() => {
      setIsDataLoading(true);

      // limit of the data per page
      let limit = 50;
      const tableHeaderHight = document
        .getElementById("tableHeader")
        ?.getBoundingClientRect().height;
      const dataSectionHight = document
        .getElementById("dataSection")
        ?.getBoundingClientRect().height;
      const tableCellHight = document
        .getElementById("tableCell")
        ?.getBoundingClientRect().height;
      const paginationControlsHight = document
        .getElementById("paginationControls")
        ?.getBoundingClientRect().height;
      if (isFirstTimeLoading) {
        setIsFirstTimeLoading(false);
        if (dataSectionHight && paginationControlsHight) {
          // 51.5 is hight of tableHeader and 33 is hight of tableRow
          // They are hardcoded because they not loaded yet
          limit = Math.floor(
            (dataSectionHight - paginationControlsHight - 51.5) / 33
          );
        }
      } else {
        if (
          tableHeaderHight &&
          dataSectionHight &&
          paginationControlsHight &&
          tableCellHight
        )
          limit = Math.floor(
            (dataSectionHight - tableHeaderHight - paginationControlsHight) /
              tableCellHight
          );
      }
      setLimit(limit);

      workerRef.current?.postMessage({
        action: "getTableData",
        payload: { currentTable, filters, sorters, limit, offset }
      });
    }, 100);

    return () => clearTimeout(handler);
  }, [
    currentTable,
    filters,
    sorters,
    isFirstTimeLoading,
    offset,
    setLimit,
    setIsDataLoading
  ]);

  // Handle file upload by sending the file to the worker
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        workerRef.current?.postMessage({
          action: "openFile",
          payload: { file: arrayBuffer }
        });
      };
      reader.readAsArrayBuffer(file);
    },
    []
  );

  // Handle when user downloads the database
  const handleDownload = useCallback(() => {
    workerRef.current?.postMessage({ action: "download" });
  }, []);

  // Handle when user changes the table
  const handleTableChange = useCallback(
    (selectedTable: string) => {
      setFilters(null);
      setSorters(null);
      resetPagination();
      setMaxSize(0);
      setSelectedRowObject(null);
      setIsInserting(false);
      setCurrentTable(selectedTable);
      setColumns(tablesSchema[selectedTable].schema.map((col) => col.name));
    },
    [
      setFilters,
      setSorters,
      resetPagination,
      setMaxSize,
      setCurrentTable,
      setSelectedRowObject,
      setIsInserting,
      tablesSchema,
      setColumns
    ]
  );

  // Handle when user updates the filter
  const handleQueryFilter = useCallback(
    (column: string, value: string) => {
      const currentFilters = useDatabaseStore.getState().filters || {};
      const newFilters = { ...currentFilters, [column]: value };
      setFilters(newFilters);
      resetPagination();
    },
    [setFilters, resetPagination]
  );

  // Handle when user updates the sorter
  const handleQuerySorter = useCallback(
    (column: string) => {
      const isMutableColumns = false; // TODO: in settings tab user can change this

      const currentSorters = useDatabaseStore.getState().sorters || {};
      const currentSortOrder = currentSorters[column] || "asc";
      const newSortOrder = currentSortOrder === "asc" ? "desc" : "asc";

      const newSorters = isMutableColumns
        ? { ...currentSorters, [column]: newSortOrder }
        : { [column]: newSortOrder };

      setSorters(newSorters as Sorters);
    },
    [setSorters]
  );

  // Handles when user changes the page
  const handlePageChange = useCallback(
    (type: "next" | "prev" | "first" | "last" | number) => {
      const currentOffset = useDatabaseStore.getState().offset;
      // use currentOffset instead of prev
      if (typeof type === "number") {
        setOffset(type);
      } else if (type === "next") {
        setOffset(currentOffset + limit);
      } else if (type === "prev") {
        setOffset(currentOffset - limit);
      } else if (type === "first") {
        setOffset(0);
      } else if (type === "last") {
        setOffset(maxSize - limit);
      }
      setSelectedRowObject(null);
    },
    [maxSize, limit, setOffset, setSelectedRowObject]
  );

  // Handle when user exports the data
  const handleExport = useCallback(
    (exportType: "table" | "current") => {
      workerRef.current?.postMessage({
        action: "export",
        payload: {
          table: currentTable,
          offset,
          limit,
          filters,
          sorters,
          exportType: exportType
        }
      });
    },
    [currentTable, filters, sorters, offset, limit]
  );

  // Handle SQL statement execution by sending it to the worker
  const handleQueryExecute = useCallback(() => {
    const query = customQuery;
    if (!query) return;
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
        payload: {
          query: stmt,
          currentTable,
          filters,
          sorters,
          limit,
          offset
        }
      });
    }
  }, [
    currentTable,
    filters,
    sorters,
    limit,
    offset,
    setIsDataLoading,
    customQuery
  ]);

  // Handle when user submits the edit form
  const handleEditSubmit = useCallback(
    (type: "insert" | "update" | "delete") => {
      setIsDataLoading(true);
      workerRef.current?.postMessage({
        action: type,
        payload: {
          table: currentTable,
          columns: useDatabaseStore.getState().columns,
          values: usePanelStore.getState().editValues,
          whereValues: selectedRowObject?.data
        }
      });
      // Refresh the data
      workerRef.current?.postMessage({
        action: "refresh",
        payload: {
          currentTable: currentTable,
          offset,
          limit,
          filters,
          sorters
        }
      });
    },
    [
      currentTable,
      filters,
      sorters,
      offset,
      limit,
      setIsDataLoading,
      selectedRowObject
    ]
  );

  const value = {
    workerRef,
    handleFileChange,
    handleDownload,
    handleTableChange,
    handleQueryFilter,
    handleQuerySorter,
    handlePageChange,
    handleExport,
    handleQueryExecute,
    handleEditSubmit
  };

  return (
    <DatabaseWorkerContext.Provider value={value}>
      {children}
    </DatabaseWorkerContext.Provider>
  );
};

export const useDatabaseWorker = () => {
  const context = useContext(DatabaseWorkerContext);

  if (context === undefined)
    throw new Error(
      "useDatabaseWorker must be used within a DatabaseWorkerProvider"
    );

  return context;
};
