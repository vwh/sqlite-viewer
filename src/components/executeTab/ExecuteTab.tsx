import { useDatabaseStore } from "@/store/useDatabaseStore";
import { usePanelStore } from "@/store/usePanelStore";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import CustomSQLTextarea from "./CustomSQLTextarea";
import SchemaTree from "@/components/structureTab/SchemaTree";
import CustomQueryDataTable from "./CustomQueryDataTable";

import { PlayIcon, FolderOutputIcon, LoaderCircleIcon } from "lucide-react";

const ExecuteTab = () => {
  const customQueryObject = useDatabaseStore(
    (state) => state.customQueryObject
  );
  const errorMessage = useDatabaseStore((state) => state.errorMessage);
  const isDataLoading = useDatabaseStore((state) => state.isDataLoading);
  const isDatabaseLoading = useDatabaseStore(
    (state) => state.isDatabaseLoading
  );

  const dataPanelSize = usePanelStore((state) => state.dataPanelSize);
  const schemaPanelSize = usePanelStore((state) => state.schemaPanelSize);
  const setDataPanelSize = usePanelStore((state) => state.setDataPanelSize);
  const setSchemaPanelSize = usePanelStore((state) => state.setSchemaPanelSize);

  const { handleQueryExecute } = useDatabaseWorker();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b px-1 py-2">
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={handleQueryExecute}
          title="Execute SQL"
        >
          <PlayIcon className="mr-1 h-3 w-3" />
          Execute SQL
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-xs"
          disabled={!customQueryObject?.data}
        >
          <FolderOutputIcon className="mr-1 h-3 w-3" />
          Export data
        </Button>
        {(isDataLoading || isDatabaseLoading) && (
          <span className="ml-2 flex items-center text-xs text-gray-500">
            <LoaderCircleIcon className="mr-1 h-3 w-3 animate-spin" />
            Loading data
          </span>
        )}
      </div>

      <div className="h-full overflow-hidden">
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
                <div className="flex h-full flex-col justify-between border">
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
            <div className="h-full overflow-hidden">
              <div className="h-full overflow-y-auto">
                <SchemaTree />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ExecuteTab;
