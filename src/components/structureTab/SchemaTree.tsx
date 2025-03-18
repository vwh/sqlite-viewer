import { memo, useMemo, useState } from "react";
import { useSchemaStore } from "@/store/useSchemaStore";
import { useDatabaseStore } from "@/store/useDatabaseStore";

import { cn } from "@/lib/utils";

import type { TableSchema, IndexSchema, TableSchemaRow } from "@/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Span } from "@/components/ui/span";
import ColumnIcon from "@/components/table/ColumnIcon";

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

const TableColumn = memo(
  ({ columnSchema }: { columnSchema: TableSchemaRow }) => {
    return (
      <div className="flex items-center gap-1 justify-between">
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
    );
  }
);

const ToggleChevron = memo(
  ({ expanded, size = 4 }: { expanded: boolean; size?: number }) => {
    return expanded ? (
      <ChevronDownIcon className={`h-${size} w-${size}`} />
    ) : (
      <ChevronRightIcon className={`h-${size} w-${size}`} />
    );
  }
);

const TableItem = memo(
  ({ name, table }: { name: string; table: { schema: TableSchemaRow[] } }) => {
    const { expandedTables, toggleTable } = useSchemaStore();
    const expanded = expandedTables.includes(name);

    const handleToggle = () => toggleTable(name);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTable(name);
      }
    };

    return (
      <article>
        <div
          className={cn(
            "flex items-center py-1 cursor-pointer hover:ml-2 transition-all rounded px-1.5",
            expanded && "ml-1"
          )}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={expanded}
        >
          <div className="flex items-center justify-center w-5 h-5">
            <ToggleChevron expanded={expanded} />
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
              <TableColumn key={idx} columnSchema={columnSchema} />
            ))}
          </div>
        )}
      </article>
    );
  }
);

const SectionHeader = memo(
  ({
    title,
    expanded,
    icon,
    onToggle,
    children,
  }: {
    title: string;
    expanded: boolean;
    icon: React.ReactNode;
    onToggle: () => void;
    children?: React.ReactNode;
  }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onToggle();
      }
    };

    return (
      <header
        className={cn(
          "flex items-center py-2 px-2 cursor-pointer hover:bg-primary/5 bg-primary/7 transition-colors",
          !expanded && "mb-0"
        )}
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={expanded}
      >
        <div className="flex items-center justify-center w-5 h-5">
          <ToggleChevron expanded={expanded} size={5} />
        </div>
        {icon}
        <span>{title}</span>
        {children}
      </header>
    );
  }
);

const TablesSection = memo(
  ({ tablesSchema }: { tablesSchema: TableSchema }) => {
    const {
      expandedTableSection,
      toggleTableSection,
      expandAllTables,
      collapseAllTables,
    } = useSchemaStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpandAll = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      expandAllTables(tablesSchema);
      setIsExpanded(true);
    };

    const handleCollapseAll = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      collapseAllTables();
      setIsExpanded(false);
    };

    const expandControls = expandedTableSection && (
      <div className="ml-auto flex">
        {isExpanded ? (
          <Button
            className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/5 rounded transition-colors"
            variant="ghost"
            size="icon"
            onClick={handleCollapseAll}
            aria-label="Collapse all tables"
          >
            <ChevronsDownUpIcon className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            className="text-xs px-2 py-0.5 h-7 text-primary hover:bg-primary/5 rounded transition-colors"
            variant="ghost"
            size="icon"
            onClick={handleExpandAll}
            aria-label="Expand all tables"
          >
            <ChevronsUpDownIcon className="w-4 h-4" />
          </Button>
        )}
      </div>
    );

    return (
      <section>
        <SectionHeader
          title="Tables"
          expanded={expandedTableSection}
          icon={<DatabaseIcon className="h-4 w-4 mr-2" />}
          onToggle={toggleTableSection}
        >
          {expandControls}
        </SectionHeader>

        {expandedTableSection && (
          <div className="pl-2 space-y-0.5 overflow-y-auto pr-1">
            {Object.entries(tablesSchema).map(([tableName, tableData]) => (
              <TableItem key={tableName} name={tableName} table={tableData} />
            ))}
          </div>
        )}
      </section>
    );
  }
);

// Index item component
const IndexItem = memo(({ index }: { index: IndexSchema }) => {
  return (
    <article>
      <div className="flex items-center py-1 cursor-pointer hover:ml-2 rounded px-1.5 transition-all">
        <div className="flex gap-1 items-center justify-between w-full">
          <span className="text-sm">{index.name}</span>
          <Span className="text-xs text-primary/60 font-medium whitespace-nowrap">
            {index.tableName}
          </Span>
        </div>
      </div>
    </article>
  );
});

// Indexes section with expandable header
const IndexesSection = memo(({ indexes }: { indexes: IndexSchema[] }) => {
  const { expandedIndexSection, toggleIndexSection } = useSchemaStore();

  return (
    <section>
      <SectionHeader
        title="Indexes"
        expanded={expandedIndexSection}
        icon={<TagIcon className="h-4 w-4 mr-2" />}
        onToggle={toggleIndexSection}
      />

      {expandedIndexSection && (
        <div className="pl-2 space-y-0.5 overflow-y-auto pr-1">
          {indexes.map((index, idx) => (
            <IndexItem key={idx} index={index} />
          ))}
        </div>
      )}
    </section>
  );
});

const SchemaSearch = memo(
  ({ onFilterChange }: { onFilterChange: (value: string) => void }) => {
    return (
      <div className="relative">
        <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
        <Input
          placeholder="Search tables and indexes"
          className="pl-8 h-8 text-sm w-full text-[0.8rem]! border-primary/20"
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label="Search tables and indexes"
        />
      </div>
    );
  }
);

const SchemaFooter = memo(
  ({ tableCount, indexCount }: { tableCount: number; indexCount: number }) => {
    return (
      <footer className="p-2 bg-primary/5 border-t flex justify-between items-center text-xs text-primary/60 gap-2">
        <div className="flex items-center">
          <TableIcon className="h-3 w-3 mr-1 text-wrap" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {tableCount} Tables
          </span>
        </div>
        <div className="flex items-center">
          <TagIcon className="h-3 w-3 mr-1" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {indexCount} Indexes
          </span>
        </div>
      </footer>
    );
  }
);

const SchemaTree = () => {
  const [filter, setFilter] = useState("");
  const { tablesSchema, indexesSchema } = useDatabaseStore();

  // Filter tables and indexes based on search term
  const filteredTables = useMemo(() => {
    if (!filter) return tablesSchema;

    const filtered: TableSchema = {};

    for (const [tableName, tableData] of Object.entries(tablesSchema)) {
      if (tableName.toLowerCase().includes(filter.toLowerCase())) {
        filtered[tableName] = tableData;
      }
    }

    return filtered;
  }, [tablesSchema, filter]);

  const filteredIndexes = useMemo(() => {
    if (!filter) return indexesSchema;

    return indexesSchema.filter(
      (index) =>
        index.name.toLowerCase().includes(filter.toLowerCase()) ||
        index.tableName.toLowerCase().includes(filter.toLowerCase())
    );
  }, [indexesSchema, filter]);

  return (
    <main className="w-full h-full flex flex-col overflow-hidden">
      <div className="p-2 bg-primary/5 border-b">
        <SchemaSearch onFilterChange={setFilter} />
      </div>
      <nav className="flex-1 overflow-auto">
        <TablesSection tablesSchema={filteredTables} />
        {indexesSchema.length > 0 && (
          <IndexesSection indexes={filteredIndexes} />
        )}
      </nav>
      <SchemaFooter
        tableCount={Object.keys(tablesSchema).length}
        indexCount={indexesSchema.length}
      />
    </main>
  );
};

export default SchemaTree;
