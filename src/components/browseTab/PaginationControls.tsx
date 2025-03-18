import { useMemo } from "react";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { usePanelManager } from "@/providers/PanelProvider";

import { Button } from "@/components/ui/button";

import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderOutputIcon,
  PlusIcon,
} from "lucide-react";

const PaginationControls = () => {
  const { handlePageChange, handleExport } = useDatabaseWorker();
  const { isInserting, handleInsert } = usePanelManager();
  const { offset, limit, maxSize, isDataLoading } = useDatabaseStore();

  const paginationControls = useMemo(
    () => (
      <footer
        className="flex items-center justify-between bg-background border-t w-full"
        id="paginationControls"
      >
        <section className="flex items-center gap-1 grow bg-primary/10 p-2">
          <Button
            onClick={() => handlePageChange("first")}
            disabled={offset === 0 || isDataLoading}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            title="Go to the first data"
          >
            <ChevronFirstIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handlePageChange("prev")}
            disabled={offset === 0 || isDataLoading}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            title="Go to the previous data"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <span className="text-xs px-2 whitespace-nowrap">
            {offset + 1}
            {" -> "}
            {offset + limit > maxSize ? maxSize : offset + limit} of {maxSize}
          </span>
          <Button
            onClick={() => handlePageChange("next")}
            disabled={offset + limit >= maxSize || isDataLoading}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            title="Go to the next data"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handlePageChange("last")}
            disabled={offset + limit >= maxSize || isDataLoading}
            size="icon"
            variant="outline"
            className="h-7 w-7"
            title="Go to the last data"
          >
            <ChevronLastIcon className="h-4 w-4" />
          </Button>
        </section>
        <section className="md:flex items-center gap-1 hidden bg-primary/10 p-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={handleInsert}
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
            Export data
          </Button>
        </section>
      </footer>
    ),
    [
      maxSize,
      handlePageChange,
      isDataLoading,
      handleExport,
      isInserting,
      offset,
      limit,
      handleInsert,
    ]
  );

  return paginationControls;
};

export default PaginationControls;
