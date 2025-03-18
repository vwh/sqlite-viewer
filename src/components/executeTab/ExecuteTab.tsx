import { useMemo } from "react";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { usePanelStore } from "@/store/usePanelStore";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import CustomSQLTextarea from "./CustomSQLTextarea";
import SchemaTree from "@/components/structureTab/SchemaTree";
import CustomQueryDataTable from "./CustomQueryDataTable";

import { PlayIcon, FolderOutputIcon, LoaderCircleIcon } from "lucide-react";

const ExecuteTab = () => {
  const { customQueryObject, errorMessage, isDataLoading, isDatabaseLoading } =
    useDatabaseStore();

  const {
    dataPanelSize,
    schemaPanelSize,
    setDataPanelSize,
    setSchemaPanelSize,
  } = usePanelStore();

  const { handleQueryExecute } = useDatabaseWorker();

  const schemaSection = useMemo(
    () => (
      <div className="h-full overflow-y-auto">
        <SchemaTree />
      </div>
    ),
    []
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 py-2 px-1 border-b ">
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
                  <div className="p-2 text-sm text-red-400">{errorMessage}</div>
                )}
                <CustomSQLTextarea />
              </ResizablePanel>
              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={75}>
                <div className="flex flex-col h-full justify-between border">
                  <CustomQueryDataTable />
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
  );
};

export default ExecuteTab;
