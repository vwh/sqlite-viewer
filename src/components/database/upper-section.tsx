import React, { useMemo, useCallback, useEffect, useState } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";
import { useQueryData } from "@/hooks/useQueryData";
import { usePagination } from "@/hooks/usePagination";

import { Button } from "@/components/ui/button";
import StatusMessage from "@/components/stats-message";
import ExportButtons from "@/components/settings/export-buttons";
import PageSelect from "./page-select";
import TableSelect from "./table-select";
import DBTableComponent from "./table-data";
import QueryTextarea from "./query-textarea";

import {
  Trash2Icon,
  PlayIcon,
  ListRestartIcon,
  Maximize2Icon,
  Minimize2Icon
} from "lucide-react";

const MemoizedTableSelect = React.memo(TableSelect);
const MemoizedExportButtons = React.memo(ExportButtons);

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
    setCustomQuery,
    expandPage,
    setExpandPage,
    filters,
    setFilters
  } = useSQLiteStore();

  const { page, setPage, rowsPerPage } = usePagination(rowPerPageOrAuto);

  const selectedTableName = useMemo(
    () => tables[Number.parseInt(selectedTable)]?.name,
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
  }, [columns]);

  const handleQueryRemove = useCallback(() => {
    setQueryError(null);
    setCustomQuery("");
    setIsCustomQuery(false);
  }, [setIsCustomQuery, setQueryError, setCustomQuery]);

  const handleResetPage = useCallback(() => {
    setPage(0);
    handleQueryRemove();
  }, [handleQueryRemove, setPage]);

  // Reset page and filters when table changes
  useEffect(() => {
    setPage(0);
    setFilters({});
  }, [selectedTable]);

  // Reset page when any of the filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const MemoizedQueryInput = useMemo(
    () => (
      <div className="flex flex-col gap-1 md:flex-row">
        <div className="flex-grow">
          <QueryTextarea columnNames={savedColumns} />
        </div>
        <div className="flex flex-row gap-1 md:flex-col">
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
    [handleCustomQuery, handleQueryRemove, handleResetPage, page, savedColumns]
  );

  const MemoizedTableContent = useMemo(() => {
    if (isQueryLoading)
      return (
        <StatusMessage type="loading">
          Loading {selectedTableName}
        </StatusMessage>
      );

    return (
      <div className="mb-[40px] overflow-hidden rounded-lg border border-gray-200 dark:border dark:border-gray-700">
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
    savedColumns
  ]);

  const MemoizedExportButtonsComponent = useMemo(
    () => <MemoizedExportButtons />,
    []
  );

  return (
    <>
      <div className="flex flex-col gap-3 pb-8">
        <section className="rounded-lg bg-gray-100 p-4 shadow-sm dark:bg-gray-700">
          <div className="mb-[5px] flex items-center justify-between gap-1">
            <MemoizedTableSelect />
            <div className="flex items-center justify-center gap-1">
              {MemoizedExportButtonsComponent}
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
          {MemoizedQueryInput}
          {queryError && (
            <p className="mt-2 text-center text-sm text-red-500 dark:text-red-400">
              {queryError}
            </p>
          )}
        </section>
        {MemoizedTableContent}
        {!isCustomQuery && (
          <PageSelect page={page} setPage={setPage} rowsPerPage={rowsPerPage} />
        )}
      </div>
    </>
  );
}
