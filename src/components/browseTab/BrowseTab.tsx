import { useMemo, memo } from "react";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { usePanelStore } from "@/store/usePanelStore";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";
import { usePanelManager } from "@/providers/PanelProvider";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import TableSelector from "./TableSelector";
import ActionsDropdown from "./ActionsDropdown";
import EditSection from "./EditSection";
import DataTable from "./DataTable";
import SchemaTree from "@/components/structureTab/SchemaTree";
import PaginationControls from "./PaginationControls";

import {
  LoaderCircleIcon,
  FilterXIcon,
  ListRestartIcon,
  FolderOutputIcon
} from "lucide-react";

const BrowseDataTab = memo(() => {
  const {
    filters,
    sorters,
    setFilters,
    setSorters,
    isDataLoading,
    isDatabaseLoading
  } = useDatabaseStore();

  const {
    dataPanelSize,
    schemaPanelSize,
    topPanelSize,
    bottomPanelSize,
    setDataPanelSize,
    setSchemaPanelSize,
    setTopPanelSize,
    setBottomPanelSize
  } = usePanelStore();

  const { handleExport } = useDatabaseWorker();
  const { selectedRowObject, isInserting } = usePanelManager();

  const schemaSection = useMemo(
    () => (
      <div className="h-full overflow-y-auto">
        <SchemaTree />
      </div>
    ),
    []
  );

  const actionButtons = useMemo(() => {
    return (
      <>
        <div className="hidden items-center gap-1 md:flex">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => setFilters(null)}
            disabled={filters == null}
            title="Clear applied filters"
          >
            <FilterXIcon className="mr-1 h-3 w-3" />
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
            <ListRestartIcon className="mr-1 h-3 w-3" />
            Reset sorting
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => handleExport("table")}
            title="Export the current table as CSV"
          >
            <FolderOutputIcon className="mr-1 h-3 w-3" />
            Export table
          </Button>
        </div>
        <div className="md:hidden">
          <ActionsDropdown />
        </div>
      </>
    );
  }, [filters, sorters, setFilters, setSorters, handleExport]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b px-1 py-2">
        <TableSelector />
        {actionButtons}
        {(isDataLoading || isDatabaseLoading) && (
          <LoadingIndicator text="Loading data" />
        )}
      </div>

      <div className="h-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Data Table */}
          <ResizablePanel
            id="dataPanel"
            key={`data-${dataPanelSize}`}
            defaultSize={dataPanelSize}
            onResize={setDataPanelSize}
          >
            <div
              className="flex h-full flex-col justify-between border-l"
              id="dataSection"
            >
              <DataTable />
              <PaginationControls />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

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
                  selectedRowObject || isInserting ? "" : "hidden"
                }`}
              >
                <EditSection />
              </ResizablePanel>
              <ResizableHandle
                className={`${
                  selectedRowObject || isInserting ? "" : "hidden"
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
  );
});

const LoadingIndicator = ({ text }: { text: string }) => (
  <span className="ml-2 flex items-center text-xs text-gray-500">
    <LoaderCircleIcon className="mr-1 h-3 w-3 animate-spin" />
    {text}
  </span>
);

export default BrowseDataTab;
