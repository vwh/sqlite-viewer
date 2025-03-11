import React, { memo } from "react";
import { useSchemaStore } from "@/store/useSchemaStore";

import type { TableSchema, IndexSchema, TableSchemaRow } from "@/types";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  TagIcon,
  TableIcon,
  KeyRoundIcon,
  SearchIcon,
  DatabaseIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColumnIcon } from "./ColumnIcon";

const TableItem = memo(
  ({
    name,
    table,
  }: {
    name: string;
    table: { sql: string; schema: TableSchemaRow[] };
  }) => {
    const { expandedTables, toggleTable } = useSchemaStore();
    const expanded = expandedTables.includes(name);

    return (
      <div>
        <div
          className={cn(
            "flex items-center py-1.5 cursor-pointer hover:bg-primary/10 rounded px-1.5 transition-colors",
            expanded && "bg-primary/5"
          )}
          onClick={() => toggleTable(name)}
        >
          <div className="flex items-center justify-center w-5 h-5">
            {expanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </div>
          <TableIcon className="h-4 w-4 ml-1 mr-2" />
          <span className="font-medium capitalize">
            {name}{" "}
            <span className="text-xs text-primary/50">
              ({table.schema.length})
            </span>
          </span>
        </div>

        {expanded && (
          <div className="border-l-2 border-primary/20 ml-4 pl-2 mt-1 space-y-0.5 flex flex-col gap-1 mb-2">
            {table.schema.map((columnSchema, idx) => (
              <div
                className="flex items-center gap-1 justify-between"
                key={idx}
              >
                <div className="flex items-center">
                  <ColumnIcon columnSchema={columnSchema} />
                  <span className="ml-1 text-xs text-primary/60">
                    {columnSchema.name}
                  </span>
                </div>
                <span className="text-xs text-primary/60">
                  {columnSchema.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

// Tables section with expandable header
const TablesSection = memo(
  ({ tablesSchema }: { tablesSchema: TableSchema }) => {
    const {
      expandedTableSection,
      toggleTableSection,
      expandAllTables,
      collapseAllTables,
    } = useSchemaStore();

    return (
      <div>
        <div
          className={cn(
            "flex items-center py-2 px-2 cursor-pointer hover:bg-primary/10 bg-primary/5 rounded-b transition-colors",
            !expandedTableSection && "mb-0"
          )}
          onClick={toggleTableSection}
        >
          <div className="flex items-center justify-center w-5 h-5">
            {expandedTableSection ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </div>
          <DatabaseIcon className="h-4 w-4 mr-2" />
          <span className="font-bold">Tables</span>

          {expandedTableSection && (
            <div className="ml-auto flex">
              <Button
                className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/10 rounded transition-colors"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  expandAllTables(tablesSchema);
                }}
              >
                Expand All
              </Button>
              <Button
                className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/10 rounded transition-colors"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  collapseAllTables();
                }}
              >
                Collapse All
              </Button>
            </div>
          )}
        </div>

        {expandedTableSection && (
          <div className="pl-2 space-y-0.5 overflow-y-auto pr-1">
            {Object.entries(tablesSchema).map(([tableName, tableData]) => (
              <TableItem key={tableName} name={tableName} table={tableData} />
            ))}
          </div>
        )}
      </div>
    );
  }
);

// Indexes section with expandable header
const IndexesSection = memo(({ indexes }: { indexes: IndexSchema[] }) => {
  const {
    expandedIndexSection,
    toggleIndexSection,
    expandedIndexes,
    toggleIndex,
    expandAllIndexes,
    collapseAllIndexes,
  } = useSchemaStore();

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-2 px-2 cursor-pointer hover:bg-primary/10 bg-primary/5 rounded transition-colors",
          !expandedIndexSection && "mb-0"
        )}
        onClick={toggleIndexSection}
      >
        <div className="flex items-center justify-center w-5 h-5">
          {expandedIndexSection ? (
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </div>
        <TagIcon className="h-4 w-4 mr-2" />
        <span className="font-bold">Indexes</span>

        {expandedIndexSection && indexes.length > 0 && (
          <div className="ml-auto flex space-x-1">
            <Button
              className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/10 rounded transition-colors"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                expandAllIndexes(indexes);
              }}
            >
              Expand All
            </Button>
            <Button
              className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/10 rounded transition-colors"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                collapseAllIndexes();
              }}
            >
              Collapse All
            </Button>
          </div>
        )}
      </div>

      {expandedIndexSection && (
        <div className="pl-2 space-y-0.5 overflow-y-auto pr-1">
          {indexes.map((index, idx) => (
            <div key={idx}>
              <div
                className={cn(
                  "flex items-center py-1.5 cursor-pointer hover:bg-primary/10 rounded px-1.5 transition-colors",
                  expandedIndexes.includes(index.name) && "bg-primary/5"
                )}
                onClick={() => toggleIndex(index.name)}
              >
                <div className="flex items-center justify-center w-5 h-5">
                  {expandedIndexes.includes(index.name) ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </div>
                <KeyRoundIcon className="h-4 w-4 ml-1 mr-2" />
                <span className="font-medium">{index.name}</span>
                <span className="ml-2 text-xs text-primary/50">
                  on{" "}
                  <span className="font-medium capitalize">
                    {index.tableName}
                  </span>
                </span>
              </div>

              {expandedIndexes.includes(index.name) && (
                <div className="pl-9 py-1.5 font-mono text-xs text-primary/70 border-l-2 border-primary/20 ml-4 mt-1 bg-primary/5 rounded p-2 overflow-x-auto">
                  {index.sql}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Search component for filtering tables/indexes
const SchemaSearch = memo(
  ({ onFilterChange }: { onFilterChange: (value: string) => void }) => {
    return (
      <div className="relative">
        <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
        <Input
          placeholder="Search tables and indexes"
          className="pl-8 h-8 text-sm w-full"
          onChange={(e) => onFilterChange(e.target.value)}
        />
      </div>
    );
  }
);

// Main DBSchemaTree component
const DBSchemaTree = ({
  tablesSchema,
  indexesSchema,
}: {
  tablesSchema: TableSchema;
  indexesSchema: IndexSchema[];
}) => {
  const [filter, setFilter] = React.useState("");

  // Filter tables and indexes based on search term
  const filteredTables = React.useMemo(() => {
    if (!filter) return tablesSchema;

    const filtered: TableSchema = {};
    Object.entries(tablesSchema).forEach(([tableName, tableData]) => {
      if (tableName.toLowerCase().includes(filter.toLowerCase())) {
        filtered[tableName] = tableData;
      }
    });
    return filtered;
  }, [tablesSchema, filter]);

  const filteredIndexes = React.useMemo(() => {
    if (!filter) return indexesSchema;

    return indexesSchema.filter(
      (index) =>
        index.name.toLowerCase().includes(filter.toLowerCase()) ||
        index.tableName.toLowerCase().includes(filter.toLowerCase())
    );
  }, [indexesSchema, filter]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="p-2 bg-primary/5 border-b">
        <SchemaSearch onFilterChange={setFilter} />
      </div>
      <div className="flex-1 overflow-auto ">
        <TablesSection tablesSchema={filteredTables} />
        {indexesSchema.length > 0 && (
          <IndexesSection indexes={filteredIndexes} />
        )}
      </div>
      <div className="p-2 bg-primary/5 border-t flex justify-between items-center text-xs text-primary/60">
        <div className="flex items-center">
          <TableIcon className="h-3 w-3 mr-1" />
          <span>{Object.keys(tablesSchema).length} Tables</span>
        </div>
        <div className="flex items-center">
          <TagIcon className="h-3 w-3 mr-1" />
          <span>{indexesSchema.length} Indexes</span>
        </div>
      </div>
    </div>
  );
};

export default DBSchemaTree;
