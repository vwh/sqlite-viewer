import { useMemo, useCallback } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import {
  exportTableAsCSV,
  exportAllTablesAsCSV,
  exportCustomQueryAsCSV,
  downloadDatabase
} from "@/lib/sqlite";

import { Button } from "./ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { DownloadIcon } from "lucide-react";

export default function ExportButtons() {
  const { selectedTable, tables, customQuery, db } = useSQLiteStore();

  const renderExportButton = useCallback(
    (onClick: () => void, label: string, title: string, className?: string) => (
      <Button className={className} onClick={onClick} title={title}>
        <span className="ml-2">{label}</span>
      </Button>
    ),
    []
  );

  const exportButtons = useMemo(
    () =>
      db && (
        <div className="flex flex-col gap-1">
          {renderExportButton(
            () => downloadDatabase(db),
            "Export as SQLite",
            "Download database as SQLite"
          )}
          {renderExportButton(
            () => exportTableAsCSV(db, parseInt(selectedTable)),
            `Export ${tables[parseInt(selectedTable)]?.name || "selected"} table as CSV`,
            "Export selected table as CSV"
          )}
          {renderExportButton(
            () => exportAllTablesAsCSV(db),
            "Export all tables as CSV",
            "Export all tables as CSV"
          )}
          {renderExportButton(
            () => exportCustomQueryAsCSV(db, customQuery),
            "Export custom query as CSV",
            "Export the result of the custom query as CSV"
          )}
        </div>
      ),
    [db, renderExportButton, selectedTable, tables, customQuery]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button title="Open export options">
          <DownloadIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        {exportButtons}
      </PopoverContent>
    </Popover>
  );
}
