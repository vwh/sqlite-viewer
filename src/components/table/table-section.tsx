import React, { useMemo, useCallback, useEffect, useState } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import { useQueryData } from "@/hooks/useQueryData";
import { usePagination } from "@/hooks/usePagination";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PageSelect from "./page-select";
import TableSelect from "./table-select";
import DBTableComponent from "./table-data";
import StatusMessage from "@/components/stats-message";
import ExportButtons from "@/components/settings/export-buttons";

import {
  Trash2Icon,
  PlayIcon,
  ListRestartIcon,
  Maximize2Icon,
  Minimize2Icon,
  DatabaseIcon
} from "lucide-react";

export default function DBTable() {
  const {
    tables,
    selectedTable,
    tableSchemas,
    queryError,
    setQueryError,
    rowPerPageOrAuto,
    isCustomQuery,
    setIsCustomQuery,
    customQuery,
    setCustomQuery,
    expandPage,
    setExpandPage,
    filters,
    setFilters,
    setOrderBy,
    setFiltersNeedClear
  } = useSQLiteStore();

  const { page, setPage, rowsPerPage } = usePagination(rowPerPageOrAuto);

  const selectedTableName = useMemo(
    () => tables[parseInt(selectedTable)]?.name,
    [tables, selectedTable]
  );

  const { data, columns, isQueryLoading, handleCustomQuery } = useQueryData(
    selectedTableName,
    rowsPerPage,
    page
  );

  const [savedColumns, setSavedColumns] = useState<string[]>([]);

  // Save columns ( used for when filtering returns no results so it don't remove them )
  useEffect(() => {
    if (columns.length > 0) {
      setSavedColumns(columns);
    }
  }, [selectedTableName, columns]);

  const handleQueryRemove = useCallback(() => {
    setQueryError(null);
    setCustomQuery("");
    setIsCustomQuery(false);
    setFilters({});
    setFiltersNeedClear(true);
  }, [setIsCustomQuery, setQueryError, setCustomQuery]);

  const handleResetPage = useCallback(() => {
    setPage(0);
    handleQueryRemove();
  }, [handleQueryRemove, setPage]);

  // Reset page and filters when table changes
  useEffect(() => {
    setPage(0);
    setFilters({});
    setOrderBy(null);
  }, [selectedTable]);

  // Reset page when any of the filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const renderQueryInput = useMemo(
    () => (
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="relative flex-grow">
          <Input
            type="text"
            value={customQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCustomQuery(e.target.value)
            }
            placeholder="Enter your custom query"
            className="w-full rounded-lg pr-10 shadow-sm"
          />
          <DatabaseIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        </div>
        <div className="flex gap-1">
          <Button
            className="grow"
            onClick={handleCustomQuery}
            title="Run custom query"
          >
            <PlayIcon className="h-5 w-5" />
          </Button>
          <Button
            className="grow"
            onClick={handleQueryRemove}
            title="Remove query"
          >
            <Trash2Icon className="h-5 w-5" />
          </Button>
          <Button
            className="grow"
            onClick={handleResetPage}
            title="Reset to first page"
            disabled={page === 0}
          >
            <ListRestartIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    ),
    [customQuery, handleCustomQuery, handleQueryRemove, handleResetPage, page]
  );

  const renderTableContent = useMemo(() => {
    if (isQueryLoading)
      return (
        <StatusMessage type="loading">
          Loading {selectedTableName}
        </StatusMessage>
      );

    return (
      <div
        className={`${rowPerPageOrAuto === "auto" ? "mb-0" : "mb-[40px]"} overflow-hidden rounded-lg border border-gray-200 dark:border dark:border-gray-700`}
      >
        <DBTableComponent
          data={data}
          columns={savedColumns.length > 0 ? savedColumns : columns}
          tableName={selectedTableName}
          tableSchemas={tableSchemas}
        />
      </div>
    );
  }, [
    isQueryLoading,
    data,
    columns,
    selectedTableName,
    tableSchemas,
    filters,
    savedColumns
  ]);

  return (
    <div className="flex flex-col gap-3 pb-8">
      <section className="rounded-lg bg-gray-100 p-4 shadow-sm dark:bg-gray-700">
        <div className="mb-[7px] flex items-center justify-between gap-2">
          <TableSelect />
          <div className="flex items-center justify-center gap-1">
            <ExportButtons />
            <Button
              className="hidden expand:block"
              onClick={() => setExpandPage(!expandPage)}
              title="Toggle page size"
            >
              {expandPage ? (
                <Minimize2Icon className="h-5 w-5" />
              ) : (
                <Maximize2Icon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        {renderQueryInput}
        {queryError && (
          <p className="mt-2 text-center text-sm text-red-500 dark:text-red-400">
            {queryError}
          </p>
        )}
      </section>
      {renderTableContent}
      {!isCustomQuery && (
        <PageSelect page={page} setPage={setPage} rowsPerPage={rowsPerPage} />
      )}
    </div>
  );
}
