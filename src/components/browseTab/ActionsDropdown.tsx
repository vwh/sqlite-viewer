import { useMemo } from "react";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { usePanelManager } from "@/providers/PanelProvider";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import {
  ChevronDownIcon,
  FilterXIcon,
  FolderOutputIcon,
  ListRestartIcon,
  PlusIcon
} from "lucide-react";

const ActionsDropdown = () => {
  const { handleExport } = useDatabaseWorker();
  const { isInserting, handleInsert } = usePanelManager();
  const { filters, setFilters, sorters, setSorters } = useDatabaseStore();

  const dropDownActions = useMemo(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Actions <ChevronDownIcon className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start text-xs"
              onClick={() => setFilters(null)}
              disabled={filters == null}
              title="Clear applied filters"
            >
              <FilterXIcon className="mr-1 h-3 w-3" />
              Clear filters
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start text-xs"
              onClick={() => setSorters(null)}
              disabled={sorters == null}
              title="Reset sorting"
            >
              <ListRestartIcon className="mr-1 h-3 w-3" />
              Reset sorting
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start text-xs"
              onClick={handleInsert}
              disabled={isInserting}
              title="Insert a new row"
            >
              <PlusIcon className="mr-1 h-3 w-3" />
              Insert row
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start text-xs"
              onClick={() => handleExport("table")}
              title="Export the current table as CSV"
            >
              <FolderOutputIcon className="mr-1 h-3 w-3" />
              Export table
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start text-xs"
              onClick={() => handleExport("current")}
              title="Export the current data as CSV"
            >
              <FolderOutputIcon className="mr-1 h-3 w-3" />
              Export data
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [
      filters,
      sorters,
      handleExport,
      handleInsert,
      isInserting,
      setFilters,
      setSorters
    ]
  );

  return dropDownActions;
};

export default ActionsDropdown;
