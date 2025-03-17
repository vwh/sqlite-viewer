import { useState, useEffect, useMemo, useCallback } from "react";
import { useDatabaseWorker } from "./providers/DatabaseWorkerProvider";
import { useDatabaseStore } from "./store/useDatabaseStore";
import { usePanelStore } from "./store/usePanelStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColumnIcon from "./components/table/ColumnIcon";
import DBSchemaTree from "./components/DBSchemaTree";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import TopBar from "./components/TopBar";
import CustomSQLTextarea from "./components/CustomSQLTextarea";
import Span from "./components/Span";

import TableSelector from "./components/TableSelector";
import FilterInput from "./components/table/FilterInput";
import ActionsDropdown from "./components/ActionsDropdown";
import PaginationControls from "./components/PaginationControls";

import {
  ArrowDownNarrowWideIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
  ChevronLeftIcon,
  FilterXIcon,
  ListRestartIcon,
  PlayIcon,
  FolderOutputIcon,
  PlusIcon,
  LoaderCircleIcon,
  Trash2Icon,
  SquarePenIcon,
} from "lucide-react";
import { usePanelManager } from "./providers/PanelProvider";

export default function App() {
  const {
    handleQueryExecute,
    handleQuerySorter,
    handleExport,
    handleEditSubmit,
    handleQueryFilter,
  } = useDatabaseWorker();

  const {
    handleRowClick,
    selectedRowData,
    isInserting,
    goBackToData,
    expandDataPanel,
  } = usePanelManager();

  const {
    tablesSchema,
    currentTable,
    data,
    columns,
    isDatabaseLoading,
    isDataLoading,
    errorMessage,
    filters,
    sorters,
    customQueryObject,
    setFilters,
    setSorters,
  } = useDatabaseStore();

  const {
    schemaPanelSize,
    dataPanelSize,
    topPanelSize,
    bottomPanelSize,
    setTopPanelSize,
    setBottomPanelSize,
    setSchemaPanelSize,
    setDataPanelSize,
    isMobile,
  } = usePanelStore();

  const [activeTab, setActiveTab] = useState("data");

  const [query, setQuery] = useState("");

  const [editValues, setEditValues] = useState<string[]>([]);

  // Update formValues when selectedRow changes
  useEffect(() => {
    if (selectedRowData) {
      setEditValues(
        selectedRowData.data.map((value) => value?.toString() ?? "null")
      );
    }
  }, [selectedRowData]);

  // Update formValues when isInserting or selectedRow changes
  useEffect(() => {
    if (isInserting) {
      // When inserting, initialize with empty strings or default values
      setEditValues(columns?.map(() => "") || []);
    } else if (selectedRowData) {
      // When editing, set values from the selected row
      setEditValues(
        selectedRowData.data.map((value) => value?.toString() ?? "")
      );
    }
  }, [isInserting, selectedRowData, columns]);

  // Update panel sizes when active tab changes
  useEffect(() => {
    // When switching to execute tab, ensure proper panel sizes
    if (activeTab === "execute" && dataPanelSize <= 0) {
      expandDataPanel();
    }
  }, [activeTab, dataPanelSize, expandDataPanel]);

  // Handle when user updates the edit inputs
  const handlEditInputChange = useCallback(
    (index: number, newValue: string) => {
      const newEditValues = [...editValues];
      newEditValues[index] = newValue;
      setEditValues(newEditValues);
    },
    [editValues]
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
              <ArrowDownNarrowWideIcon className="h-4 w-3" />
            </button>
          ) : (
            <button
              title="Sort column in ascending order"
              type="button"
              aria-label="Sort Ascending"
              disabled={isDataLoading}
              onClick={() => handleQuerySorter(column)}
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
          >
            <ArrowUpDownIcon className="h-3 w-3" />
          </button>
        )}
      </>
    ),
    [sorters, handleQuerySorter, isDataLoading]
  );

  const schemaSection = useMemo(
    () => (
      <div className="h-full overflow-y-auto">
        <DBSchemaTree />
      </div>
    ),
    []
  );

  const schemaTab = useMemo(
    () => (
      <div className="flex flex-col h-full ">
        {/* <div className="flex items-center gap-1 p-2">
          <Button size="sm" variant="outline" className="text-xs">
            Create Table
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            Create Index
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            Print Schema
          </Button>
        </div> */}
        <div className="flex-1 overflow-hidden">{schemaSection}</div>
      </div>
    ),
    [schemaSection]
  );

  const editSection = useMemo(
    () => (
      <div className="h-full overflow-auto">
        <div className="flex flex-col w-full h-full">
          <div className="overflow-auto">
            <div className="text-sm p-2 bg-primary/5 w-full border-b flex items-center gap-1 justify-between">
              <div className="flex items-center gap-1">
                {isInserting ? (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    <Span className="whitespace-nowrap">Inserting row</Span>
                  </>
                ) : (
                  <>
                    <SquarePenIcon className="h-4 w-4" />
                    <Span className="whitespace-nowrap">Updating row</Span>
                  </>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs md:hidden"
                onClick={goBackToData}
              >
                <ChevronLeftIcon className="h-3 w-3 mr-1" />
                Go back
              </Button>
            </div>
            {columns?.map((column, index) => (
              <div key={column}>
                <div className="flex items-center gap-1 bg-primary/5 p-2 rounded-sm">
                  <ColumnIcon
                    columnSchema={tablesSchema[currentTable!]?.schema[index]}
                  />
                  <Span className="capitalize font-medium text-xs">
                    {column}
                  </Span>
                </div>
                <Input
                  name={column}
                  className="h-8 text-sm border-primary/20 text-[0.8rem]! rounded-none"
                  value={editValues[index] || ""}
                  onChange={(e) => handlEditInputChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
          {isInserting ? (
            <div className="flex w-full">
              <Button
                size="sm"
                variant="outline"
                className="text-xs w-full"
                onClick={() =>
                  handleEditSubmit("insert", editValues, selectedRowData)
                }
              >
                <PlusIcon className="h-3 w-3 mr-1" />
                Insert row
              </Button>
            </div>
          ) : (
            <div className="flex w-full">
              <Button
                size="sm"
                variant="outline"
                className="text-xs rounded-none grow"
                onClick={() =>
                  handleEditSubmit("update", editValues, selectedRowData)
                }
                // TODO: disable it if the data is the same as the current row and didn't change
                title="Update this row"
              >
                <SquarePenIcon className="h-3 w-3 mr-1" />
                Apply changes
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="text-xs rounded-none"
                onClick={() =>
                  handleEditSubmit("delete", editValues, selectedRowData)
                }
                title="Delete this row"
              >
                <Trash2Icon className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    ),
    [
      currentTable,
      tablesSchema,
      columns,
      editValues,
      handlEditInputChange,
      handleEditSubmit,
      isInserting,
      selectedRowData,
      goBackToData,
    ]
  );

  const customQueryDataTable = useMemo(
    () => (
      <>
        {customQueryObject ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                {customQueryObject.columns.map((column) => (
                  <TableHead key={column} className="p-1 text-xs">
                    <div className="flex items-center gap-1">
                      <Span className="capitalize font-medium text-foreground">
                        {column}
                      </Span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {customQueryObject.data && customQueryObject.data.length > 0 ? (
                customQueryObject.data.map((row, i) => (
                  <TableRow key={i} className="hover:bg-primary/5 text-xs">
                    {row.map((value, j) => (
                      <TableCell key={j} className="p-2">
                        {value ? (
                          <Span>{value}</Span>
                        ) : (
                          <span className="text-muted-foreground italic">
                            NULL
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={customQueryObject?.columns?.length || 1}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-1 h-full">
                      <h3 className="text-md font-medium">No Data To Show</h3>
                      <p className="text-sm">
                        Seems like there is no data to display
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 h-full">
            <h3 className="text-md font-medium">No Data To Show</h3>
            <p className="text-sm">Execute a query to view data</p>
          </div>
        )}
      </>
    ),
    [customQueryObject]
  );

  const executeTab = useMemo(
    () => (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-1 py-2 px-1 border-b ">
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => {
              handleQueryExecute(query);
            }}
            title="Execute SQL"
          >
            <PlayIcon className="h-3 w-3 mr-1" />
            Execute SQL
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            disabled={!customQueryObject?.data}
          >
            <FolderOutputIcon className="h-3 w-3 mr-1" />
            Export data
          </Button>
          {(isDataLoading || isDatabaseLoading) && (
            <span className="text-xs ml-2 text-gray-500 flex items-center">
              <LoaderCircleIcon className="h-3 w-3 mr-1 animate-spin" />
              Loading data
            </span>
          )}
        </div>

        <div className="overflow-hidden h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel
              defaultSize={dataPanelSize}
              onResize={setDataPanelSize}
            >
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={25}>
                  {errorMessage && (
                    <div className="p-2 text-sm text-red-400">
                      {errorMessage}
                    </div>
                  )}
                  {/* <textarea
                    className="w-full h-full p-2 border font-mono text-sm resize-none"
                    placeholder="Enter SQL"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  /> */}
                  <CustomSQLTextarea
                    query={query}
                    setQuery={setQuery}
                    tableSchema={tablesSchema}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={75}>
                  <div className="flex flex-col h-full justify-between border">
                    {customQueryDataTable}
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel
              defaultSize={schemaPanelSize}
              onResize={setSchemaPanelSize}
              className=""
            >
              <div className="h-full overflow-hidden">{schemaSection}</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    ),
    [
      query,
      handleQueryExecute,
      errorMessage,
      customQueryDataTable,
      isDataLoading,
      schemaSection,
      customQueryObject,
      isDatabaseLoading,
      dataPanelSize,
      schemaPanelSize,
      tablesSchema,
      setDataPanelSize,
      setSchemaPanelSize,
    ]
  );

  const dataTable = useMemo(
    () => (
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/5">
            {columns && currentTable ? (
              columns.map((column, index) => (
                <TableHead key={column} className="p-1 text-xs">
                  <div className="flex items-center py-[1.5px] gap-1">
                    {sorterButton(column)}
                    <Span className="capitalize font-medium text-foreground">
                      {column}
                    </Span>
                    <ColumnIcon
                      columnSchema={tablesSchema[currentTable].schema[index]}
                    />
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
                onClick={() => handleRowClick(row, i)}
                className={`cursor-pointer hover:bg-primary/5 text-xs ${
                  selectedRowData?.index === i ? "bg-primary/5" : ""
                }`}
              >
                {row.map((value, j) => (
                  <TableCell key={j} className="p-2">
                    {/* Check if it is blob and show a <span>blob</span> */}
                    {value ? (
                      <>
                        {tablesSchema[currentTable!].schema[j]?.type ===
                        "BLOB" ? (
                          <span className="text-muted-foreground italic">
                            BLOB
                          </span>
                        ) : (
                          <Span>{value}</Span>
                        )}
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">NULL</span>
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
                <div className="flex flex-col items-center justify-center gap-1 h-full">
                  {filters ? (
                    <>
                      <p className="text-md font-medium">
                        No Data To Show For Current Filters
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setFilters(null)}
                      >
                        <FilterXIcon className="mr-1 h-3 w-3" />
                        Clear filters
                      </Button>
                    </>
                  ) : (
                    <>
                      {" "}
                      <h3 className="text-md font-medium">No Data To Show</h3>
                      <p className="text-sm">
                        This table does not have any data to display
                      </p>
                    </>
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
      selectedRowData,
      sorterButton,
      columns,
      currentTable,
      tablesSchema,
      handleRowClick,
      setFilters,
    ]
  );

  const dataTab = useMemo(
    () => (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-1 py-2 px-1 border-b ">
          <TableSelector />
          <div className="md:flex items-center gap-1 hidden">
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
          </div>
          <div className="md:hidden">
            <ActionsDropdown />
          </div>
          {(isDataLoading || isDatabaseLoading) && (
            <span className="text-xs ml-2 text-gray-500 flex items-center">
              <LoaderCircleIcon className="h-3 w-3 mr-1 animate-spin" />
              Loading data
            </span>
          )}
        </div>

        <div className="overflow-hidden h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Data Table */}
            <ResizablePanel
              id="dataPanel"
              key={`data-${dataPanelSize}`}
              defaultSize={dataPanelSize}
              onResize={setDataPanelSize}
            >
              <div
                className="flex flex-col h-full justify-between border-l"
                id="dataSection"
              >
                {dataTable}
                <PaginationControls />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Split Vertically */}
            <ResizablePanel
              id="schemaPanel"
              key={`schema-${schemaPanelSize}`}
              defaultSize={schemaPanelSize}
              onResize={setSchemaPanelSize}
              className=""
            >
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel
                  id="topPanel"
                  key={`top-${topPanelSize}`}
                  defaultSize={topPanelSize}
                  onResize={setTopPanelSize}
                  className={`${
                    selectedRowData || isInserting ? "" : "hidden"
                  }`}
                >
                  {editSection}
                </ResizablePanel>
                <ResizableHandle
                  className={`${
                    selectedRowData || isInserting ? "" : "hidden"
                  }`}
                  withHandle
                />
                <ResizablePanel
                  id="bottomPanel"
                  key={`bottom-${bottomPanelSize}`}
                  defaultSize={bottomPanelSize}
                  onResize={setBottomPanelSize}
                >
                  <div className="h-full overflow-hidden">{schemaSection}</div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    ),
    [
      dataTable,
      filters,
      sorters,
      selectedRowData,
      isDataLoading,
      isDatabaseLoading,
      schemaSection,
      editSection,
      handleExport,
      isInserting,
      dataPanelSize,
      schemaPanelSize,
      topPanelSize,
      bottomPanelSize,
      setFilters,
      setSorters,
      setDataPanelSize,
      setSchemaPanelSize,
      setTopPanelSize,
      setBottomPanelSize,
    ]
  );

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-primary/5">
      <TopBar />
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mt-2 bg-primary/5 w-full justify-start border-b rounded-none h-9">
          <TabsTrigger
            id="structure"
            key="structure"
            disabled={isDatabaseLoading}
            value="structure"
            className="text-xs h-8 data-[state=active]: data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Database Structure
          </TabsTrigger>
          <TabsTrigger
            id="data"
            key="data"
            disabled={isDatabaseLoading}
            value="data"
            className="text-xs h-8 data-[state=active]: data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Browse Data
          </TabsTrigger>
          <TabsTrigger
            disabled={isDatabaseLoading}
            id="execute"
            key="execute"
            value="execute"
            className="text-xs h-8 data-[state=active]: data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            onClick={() => {
              if (isMobile) {
                setDataPanelSize(100);
                setSchemaPanelSize(0);
              }
            }}
          >
            Execute SQL
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 max-h-custom-dvh overflow-hidden">
          <TabsContent value="data" className="h-full m-0 p-0 border-none">
            {isDatabaseLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin" />
                <span className="text-xl">Loading Database</span>
              </div>
            ) : (
              dataTab
            )}
          </TabsContent>
          <TabsContent value="structure" className="h-full m-0 p-0 border-none">
            {schemaTab}
          </TabsContent>
          <TabsContent
            value="execute"
            className="h-full m-0 p-0 border-none border"
          >
            {executeTab}
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
