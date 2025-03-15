import React, { memo, useState } from "react";
import { useSchemaStore } from "@/store/useSchemaStore";

import type { TableSchema, IndexSchema, TableSchemaRow } from "@/types";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronsDownUpIcon,
  TagIcon,
  TableIcon,
  SearchIcon,
  DatabaseIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColumnIcon } from "./ColumnIcon";
import Span from "./Span";

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

    const handleToggle = () => toggleTable(name);
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTable(name);
      }
    };

    return (
      <div>
        <div
          className={cn(
            "flex items-center py-1 cursor-pointer hover:ml-2 transition-all rounded px-1.5",
            expanded && "ml-1"
          )}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center justify-center w-5 h-5">
            {expanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </div>
          <span className="capitalize flex gap-1 items-center">
            <span className="text-sm">{name}</span>
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
                <Span className="text-xs text-primary/60 whitespace-nowrap">
                  {columnSchema.type}
                </Span>
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
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggleSection = () => toggleTableSection();
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTableSection();
      }
    };

    const handleExpandAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      expandAllTables(tablesSchema);
      setIsExpanded(true);
    };

    const handleCollapseAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      collapseAllTables();
      setIsExpanded(false);
    };

    return (
      <div>
        <div
          className={cn(
            "flex items-center py-2 px-2 cursor-pointer hover:bg-primary/5 bg-primary/7 transition-colors",
            !expandedTableSection && "mb-0"
          )}
          onClick={handleToggleSection}
          onKeyDown={handleKeyDown}
        >
          <div className="flex items-center justify-center w-5 h-5">
            {expandedTableSection ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </div>
          <DatabaseIcon className="h-4 w-4 mr-2" />
          <span>Tables</span>

          {expandedTableSection && (
            <div className="ml-auto flex">
              {isExpanded ? (
                <Button
                  className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/5 rounded transition-colors"
                  variant="ghost"
                  size="icon"
                  onClick={handleCollapseAll}
                >
                  <ChevronsDownUpIcon className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/5 rounded transition-colors"
                  variant="ghost"
                  size="icon"
                  onClick={handleExpandAll}
                >
                  <ChevronsUpDownIcon className="w-4 h-4" />
                </Button>
              )}
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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleSection = () => toggleIndexSection();
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleIndexSection();
    }
  };

  const handleExpandAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    expandAllIndexes(indexes);
    setIsExpanded(true);
  };

  const handleCollapseAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    collapseAllIndexes();
    setIsExpanded(false);
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-2 px-2 cursor-pointer hover:bg-primary/5 bg-primary/7 transition-colors",
          !expandedIndexSection && "mb-0"
        )}
        onClick={handleToggleSection}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-center w-5 h-5">
          {expandedIndexSection ? (
            <ChevronDownIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </div>
        <TagIcon className="h-4 w-4 mr-2" />
        <span>Indexes</span>

        {expandedIndexSection && indexes.length > 0 && (
          <div className="ml-auto flex space-x-1">
            {isExpanded ? (
              <Button
                className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/5 rounded transition-colors"
                variant="ghost"
                size="icon"
                onClick={handleCollapseAll}
              >
                <ChevronsDownUpIcon className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/5 rounded transition-colors"
                variant="ghost"
                size="icon"
                onClick={handleExpandAll}
              >
                <ChevronsUpDownIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {expandedIndexSection && (
        <div className="pl-2 space-y-0.5 overflow-y-auto pr-1">
          {indexes.map((index, idx) => {
            const isExpanded = expandedIndexes.includes(index.name);
            const handleToggleIndex = () => toggleIndex(index.name);
            const handleIndexKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleIndex(index.name);
              }
            };

            return (
              <div key={idx}>
                <div
                  className={cn(
                    "flex items-center py-1 cursor-pointer hover:ml-2 rounded px-1.5 transition-all",
                    isExpanded && "ml-1"
                  )}
                  onClick={handleToggleIndex}
                  onKeyDown={handleIndexKeyDown}
                >
                  <div className="flex items-center justify-center w-5 h-5">
                    {isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm">{index.name}</span>
                  {/* <span className="text-xs text-primary/50">
                    <span className="font-medium capitalize">
                      {index.tableName}
                    </span>
                  </span> */}
                </div>

                {isExpanded && (
                  <div className="pl-9 py-1.5 font-mono text-xs text-primary/70 border-l-2 border-primary/20 ml-4 mt-1 bg-primary/5 rounded p-2 overflow-x-auto">
                    {index.sql}
                  </div>
                )}
              </div>
            );
          })}
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
          className="pl-8 h-8 text-sm w-full text-[0.8rem]! border-primary/20"
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

    for (const [tableName, tableData] of Object.entries(tablesSchema)) {
      if (tableName.toLowerCase().includes(filter.toLowerCase())) {
        filtered[tableName] = tableData;
      }
    }

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
      <div className="p-2 bg-primary/5 border-t flex justify-between items-center text-xs text-primary/60 gap-2">
        <div className="flex items-center">
          <TableIcon className="h-3 w-3 mr-1 text-wrap" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {Object.keys(tablesSchema).length} Tables
          </span>
        </div>
        <div className="flex items-center">
          <TagIcon className="h-3 w-3 mr-1" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {indexesSchema.length} Indexes
          </span>
        </div>
      </div>
    </div>
  );
};

export default DBSchemaTree;
