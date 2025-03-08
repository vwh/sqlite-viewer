import { useState } from "react";

import type { TableSchema, IndexSchema, TableSchemaRow } from "@/types";

import { ColumnIcon } from "./ColumnIcon";

import {
  ChevronRightIcon,
  ChevronDownIcon,
  TagIcon,
  TableIcon,
} from "lucide-react";

const ColumnItem = ({ columnSchema }: { columnSchema: TableSchemaRow }) => {
  return (
    <div className="flex items-center pl-8 py-1 hover:bg-gray-100">
      <ColumnIcon columnSchema={columnSchema} />
      <span className="ml-2 font-mono text-sm">{columnSchema.name}</span>
      <span className="ml-auto text-xs text-gray-500 mr-4">
        {columnSchema.type}
      </span>
    </div>
  );
};

const TableItem = ({
  name,
  table,
  expanded,
  toggleExpanded,
}: {
  name: string;
  table: {
    sql: string;
    schema: TableSchemaRow[];
  };
  expanded: boolean;
  toggleExpanded: () => void;
}) => {
  return (
    <div>
      <div
        className="flex items-center py-1 cursor-pointer hover:bg-gray-100"
        onClick={toggleExpanded}
      >
        {expanded ? (
          <ChevronDownIcon className="h-4 w-4 mr-1" />
        ) : (
          <ChevronRightIcon className="h-4 w-4 mr-1" />
        )}
        <span className="ml-1 font-medium capitalize">{name}</span>
      </div>

      {expanded && (
        <div className="border-l-2 border-gray-200 ml-2">
          {table.schema.map((column, idx) => (
            <ColumnItem key={idx} columnSchema={column} />
          ))}
        </div>
      )}
    </div>
  );
};

// Component for the tables section
const TablesSection = ({
  tablesSchema,
  expandedTables,
  toggleTable,
  expandAllTables,
  collapseAllTables,
}: {
  tablesSchema: TableSchema;
  expandedTables: string[];
  toggleTable: (tableName: string) => void;
  expandAllTables: () => void;
  collapseAllTables: () => void;
}) => {
  const tableCount = Object.keys(tablesSchema).length;
  const [sectionExpanded, setSectionExpanded] = useState(true);

  const toggleSection = () => {
    setSectionExpanded(!sectionExpanded);
  };

  return (
    <div className="mb-2">
      <div
        className="flex items-center py-2 cursor-pointer hover:bg-gray-100 bg-gray-50"
        onClick={toggleSection}
      >
        {sectionExpanded ? (
          <ChevronDownIcon className="h-5 w-5 ml-1 mr-1" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 ml-1 mr-1" />
        )}
        <TableIcon className="h-4 w-4 mr-2" />
        <span className="font-bold">Tables ({tableCount})</span>

        {sectionExpanded && (
          <div className="ml-auto flex space-x-2 pr-2">
            <button
              className="text-xs text-blue-600 hover:text-blue-800"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                expandAllTables();
              }}
            >
              Expand All
            </button>
            <button
              className="text-xs text-blue-600 hover:text-blue-800"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                collapseAllTables();
              }}
            >
              Collapse All
            </button>
          </div>
        )}
      </div>

      {sectionExpanded && (
        <div className="pl-2">
          {Object.entries(tablesSchema).map(([tableName, tableData]) => (
            <TableItem
              key={tableName}
              name={tableName}
              table={tableData}
              expanded={expandedTables.includes(tableName)}
              toggleExpanded={() => toggleTable(tableName)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Component for the index section
const IndexesSection = ({ indexes }: { indexes: IndexSchema[] }) => {
  const [sectionExpanded, setSectionExpanded] = useState(true);
  const [expandedIndexes, setExpandedIndexes] = useState<string[]>([]);

  const toggleSection = () => {
    setSectionExpanded(!sectionExpanded);
  };

  const toggleIndex = (indexName: string) => {
    setExpandedIndexes((prev) =>
      prev.includes(indexName)
        ? prev.filter((name) => name !== indexName)
        : [...prev, indexName]
    );
  };

  const expandAllIndexes = () => {
    setExpandedIndexes(indexes.map((index) => index.name));
  };

  const collapseAllIndexes = () => {
    setExpandedIndexes([]);
  };

  return (
    <div>
      <div
        className="flex items-center cursor-pointer hover:bg-gray-100 bg-gray-50"
        onClick={toggleSection}
      >
        {sectionExpanded ? (
          <ChevronDownIcon className="h-5 w-5 ml-1 mr-1" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 ml-1 mr-1" />
        )}
        <TagIcon className="h-4 w-4 mr-2" />
        <span className="font-bold">Indexes ({indexes.length})</span>

        {sectionExpanded && indexes.length > 0 && (
          <div className="ml-auto flex space-x-2  pr-2">
            <button
              className="text-xs text-blue-600 hover:text-blue-800"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                expandAllIndexes();
              }}
            >
              Expand All
            </button>
            <button
              className="text-xs text-blue-600 hover:text-blue-800"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                collapseAllIndexes();
              }}
            >
              Collapse All
            </button>
          </div>
        )}
      </div>

      {sectionExpanded && (
        <div className="pl-2">
          {indexes.map((index, idx) => (
            <div key={idx}>
              <div
                className="flex items-center py-1 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleIndex(index.name)}
              >
                {expandedIndexes.includes(index.name) ? (
                  <ChevronDownIcon className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 mr-1" />
                )}
                <span className="ml-1 font-medium">{index.name}</span>
                <span className="ml-2 text-xs text-gray-500">
                  on {index.tableName}
                </span>
              </div>

              {expandedIndexes.includes(index.name) && (
                <div className="pl-8 py-1 text-xs text-gray-600 border-l-2 border-gray-200 ml-2">
                  {index.sql}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DBSchemaTree = ({
  tablesSchema,
  indexesSchema,
}: {
  tablesSchema: TableSchema;
  indexesSchema: IndexSchema[];
}) => {
  // Use localStorage to persist expanded state
  const [expandedTables, setExpandedTables] = useState<string[]>([]);

  // Save expanded state to localStorage whenever it changes
  //   useEffect(() => {
  //     localStorage.setItem("expandedTables", JSON.stringify(expandedTables));
  //   }, [expandedTables]);

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((name) => name !== tableName)
        : [...prev, tableName]
    );
  };

  const expandAllTables = () => {
    setExpandedTables(Object.keys(tablesSchema));
  };

  const collapseAllTables = () => {
    setExpandedTables([]);
  };

  return (
    <div className="shadow-sm w-full h-full flex flex-col">
      <div className="p-2 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="text-sm font-medium">Database Schema</h3>
      </div>
      <div className="p-2 flex-1 overflow-auto max-h-[calc(100vh-14rem)]">
        <TablesSection
          tablesSchema={tablesSchema}
          expandedTables={expandedTables}
          toggleTable={toggleTable}
          expandAllTables={expandAllTables}
          collapseAllTables={collapseAllTables}
        />
        {indexesSchema.length > 0 && <IndexesSection indexes={indexesSchema} />}
      </div>
    </div>
  );
};

export default DBSchemaTree;
