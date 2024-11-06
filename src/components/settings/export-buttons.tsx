import { useMemo } from "react";
import useSQLiteStore from "@/store/useSQLiteStore";

import {
  exportTableAsCSV,
  exportAllTablesAsCSV,
  exportCustomQueryAsCSV,
  downloadDatabase
} from "@/lib/sqlite";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

import { FileDownIcon } from "lucide-react";

export default function ExportButtons() {
  const { selectedTable, customQuery, db } = useSQLiteStore();

  const MemoizedButtons = useMemo(
    () =>
      db && (
        <div className="flex flex-col gap-1">
          <ExportButton
            onClick={() => {
              try {
                downloadDatabase(db);
              } catch {
                toast.error("Failed to download database");
              }
            }}
            label="Export as SQLite"
            title="Download database as SQLite"
          />

          <ExportButton
            onClick={() => {
              try {
                exportTableAsCSV(db, Number.parseInt(selectedTable));
              } catch {
                toast.error("Failed to export selected table as CSV");
              }
            }}
            label="Export selected table as CSV"
          />

          <ExportButton
            onClick={() => {
              try {
                exportAllTablesAsCSV(db);
              } catch {
                toast.error("Failed to export all tables as CSV");
              }
            }}
            label="Export all tables as CSV"
          />

          <ExportButton
            onClick={() => {
              try {
                exportCustomQueryAsCSV(db, customQuery);
              } catch {
                toast.error("Failed to export custom query as CSV");
              }
            }}
            label="Export custom query as CSV"
            title="Export the result of the custom query as CSV"
          />
        </div>
      ),
    [db, selectedTable, customQuery]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button title="Open export options">
          <FileDownIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        {MemoizedButtons}
      </PopoverContent>
    </Popover>
  );
}

interface ExportButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
  title?: string;
}

function ExportButton({ onClick, label, className, title }: ExportButtonProps) {
  return (
    <Button className={className} onClick={onClick} title={title ?? label}>
      <span className="ml-2">{label}</span>
    </Button>
  );
}
