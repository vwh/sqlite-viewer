import { useMemo, useCallback } from "react";
import { useDatabaseStore } from "@/store/useDatabaseStore";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";
import { usePanelManager } from "@/providers/PanelProvider";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Span } from "@/components/ui/span";
import ColumnIcon from "@/components/table/ColumnIcon";
import FilterInput from "@/components/table/FilterInput";

import {
  ArrowDownNarrowWideIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
  FilterXIcon,
} from "lucide-react";

const DataTable = () => {
  const {
    data,
    columns,
    currentTable,
    tablesSchema,
    filters,
    sorters,
    setFilters,
  } = useDatabaseStore();

  const { handleQuerySorter, handleQueryFilter } = useDatabaseWorker();
  const { handleRowClick, selectedRowObject } = usePanelManager();

  const sorterButton = useCallback(
    (column: string) => (
      <>
        {sorters?.[column] ? (
          sorters?.[column] === "asc" ? (
            <button
              title="Sort column in descending order"
              type="button"
              aria-label="Sort Descending"
              disabled={false}
              onClick={() => handleQuerySorter(column)}
            >
              <ArrowDownNarrowWideIcon className="h-4 w-3" />
            </button>
          ) : (
            <button
              title="Sort column in ascending order"
              type="button"
              aria-label="Sort Ascending"
              disabled={false}
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
            disabled={false}
            onClick={() => handleQuerySorter(column)}
          >
            <ArrowUpDownIcon className="h-3 w-3" />
          </button>
        )}
      </>
    ),
    [sorters, handleQuerySorter]
  );

  const emptyDataContent = useMemo(
    () => (
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
            <h3 className="text-md font-medium">No Data To Show</h3>
            <p className="text-sm">
              This table does not have any data to display
            </p>
          </>
        )}
      </div>
    ),
    [filters, setFilters]
  );

  return useMemo(
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
                  selectedRowObject?.index === i ? "bg-primary/5" : ""
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
                {emptyDataContent}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    ),
    [
      data,
      columns,
      currentTable,
      tablesSchema,
      filters,
      sorterButton,
      handleQueryFilter,
      handleRowClick,
      selectedRowObject,
      emptyDataContent,
    ]
  );
};

export default DataTable;
