import Sqlite, { CustomQueryError } from "./lib/sqlite";

import type { SqlValue } from "sql.js";
import type { Filters, Sorters } from "./types";

interface InitEvent {
  action: "init";
  payload: undefined;
}

interface OpenFileEvent {
  action: "openFile";
  payload: {
    file: ArrayBuffer;
  };
}

interface RefreshEvent {
  action: "refresh";
  payload: {
    currentTable: string;
    limit: number;
    offset: number;
    filters: Filters;
    sorters: Sorters;
  };
}

interface ExecEvent {
  action: "exec";
  payload: {
    query: string;
    currentTable: string;
    limit: number;
    offset: number;
    filters: Filters;
    sorters: Sorters;
  };
}

interface GetTableDataEvent {
  action: "getTableData";
  payload: {
    currentTable: string;
    limit: number;
    offset: number;
    filters: Filters;
    sorters: Sorters;
  };
}

interface DownloadEvent {
  action: "download";
  payload: undefined;
}

interface UpdateEvent {
  action: "update";
  payload: {
    table: string;
    columns: string[];
    values: SqlValue[];
    whereValues: SqlValue[];
  };
}

interface DeleteEvent {
  action: "delete";
  payload: {
    table: string;
    columns: string[];
    values: SqlValue[];
  };
}

interface InsertEvent {
  action: "insert";
  payload: {
    table: string;
    columns: string[];
    values: SqlValue[];
  };
}

interface ExportEvent {
  action: "export";
  payload: {
    table: string;
    filters: Filters;
    sorters: Sorters;
    limit: number;
    offset: number;
    exportType: "table" | "current";
  };
}

type WorkerEvent =
  | InitEvent
  | OpenFileEvent
  | RefreshEvent
  | ExecEvent
  | GetTableDataEvent
  | DownloadEvent
  | UpdateEvent
  | DeleteEvent
  | InsertEvent
  | ExportEvent;

// Global variable to store the database instance
let instance: Sqlite | null = null;

self.onmessage = async (event: MessageEvent<WorkerEvent>) => {
  const { action, payload } = event.data;

  // Create a new database instance
  if (action === "init") {
    instance = await Sqlite.create();
    self.postMessage({
      action: "initComplete",
      payload: {
        tableSchema: instance.tablesSchema,
        indexSchema: instance.indexesSchema,
        currentTable: instance.firstTable,
      },
    });

    return;
  }

  // Check if the database instance is initialized
  if (instance === null) {
    self.postMessage({ action: "error", payload: "Database not initialized" });
    return;
  }

  try {
    // Updates the instance from user-uploaded file
    switch (action) {
      case "openFile": {
        instance = await Sqlite.open(new Uint8Array(payload.file));
        self.postMessage({
          action: "initComplete",
          payload: {
            tableSchema: instance.tablesSchema,
            indexSchema: instance.indexesSchema,
            currentTable: instance.firstTable,
          },
        });
        break;
      }
      // Refreshes the current table data
      case "refresh": {
        const { currentTable, limit, offset, filters, sorters } =
          payload as RefreshEvent["payload"];
        const [results, maxSize] = instance.getTableData(
          currentTable,
          limit,
          offset,
          filters,
          sorters
        );
        self.postMessage({
          action: "queryComplete",
          payload: { results, maxSize },
        });
        break;
      }
      // Executes a custom query
      // User for user-typed queries
      case "exec": {
        try {
          const { query, currentTable, limit, offset, filters, sorters } =
            payload as ExecEvent["payload"];
          const [results, doTablesChanged] = instance.exec(query);
          // Check if tables changed (user created/deleted/altered table)
          if (doTablesChanged) {
            self.postMessage({
              action: "updateInstance",
              payload: {
                tableSchema: instance.tablesSchema,
                indexSchema: instance.indexesSchema,
              },
            });
          } else {
            // Check if custom query returned results
            // To render the table data
            if (results.length > 0) {
              self.postMessage({
                action: "customQueryComplete",
                payload: { results },
              });
            }
            // If not return the table data
            // Insert, Update, Delete, ...
            else {
              const [results, maxSize] = instance.getTableData(
                currentTable,
                limit,
                offset,
                filters,
                sorters
              );
              self.postMessage({
                action: "queryComplete",
                payload: { results, maxSize },
              });
            }
          }
        } catch (error) {
          // If the query throws an error
          // User for error messages
          if (error instanceof Error) {
            throw new CustomQueryError(error.message);
          }
        }
        break;
      }
      // Gets the table data for the current table/table-options
      case "getTableData": {
        const { currentTable, limit, offset, filters, sorters } =
          payload as GetTableDataEvent["payload"];
        const [results, maxSize] = instance.getTableData(
          currentTable,
          limit,
          offset,
          filters,
          sorters
        );
        self.postMessage({
          action: "queryComplete",
          payload: { results, maxSize },
        });
        break;
      }
      // Downloads the database as bytes
      case "download": {
        const bytes = instance.download();
        self.postMessage({
          action: "downloadComplete",
          payload: { bytes },
        });
        break;
      }
      // Updates the values of a row in a table
      case "update": {
        const { table, columns, values, whereValues } =
          payload as UpdateEvent["payload"];
        instance.update(table, columns, values, whereValues);
        self.postMessage({
          action: "updateComplete",
          payload: { type: "updated" },
        });
        break;
      }
      // Deletes a row from a table
      case "delete": {
        const { table, columns, values } = payload as DeleteEvent["payload"];
        instance.delete(table, columns, values);
        self.postMessage({
          action: "updateComplete",
          payload: { type: "deleted" },
        });
        break;
      }
      // Inserts a row into a table
      case "insert": {
        const { table, columns, values } = payload as InsertEvent["payload"];
        instance.insert(table, columns, values);
        self.postMessage({
          action: "insertComplete",
        });
        break;
      }
      // Exports as CSV
      // It have 2 types of exports (table, current data)
      // Current data is the current page of data
      case "export": {
        const { table, filters, sorters, limit, offset, exportType } =
          payload as ExportEvent["payload"];
        let results: string;
        if (exportType === "table") {
          results = instance.getTableAsCsv(table);
        } else {
          results = instance.getCurrentDataAsCsv(
            table,
            limit,
            offset,
            filters,
            sorters
          );
        }
        self.postMessage({
          action: "exportComplete",
          payload: { results },
        });
        break;
      }
      // Other unhandled actions
      default:
        console.warn("Unknown worker action:", action);
    }
  } catch (error) {
    if (error instanceof Error) {
      self.postMessage({
        action: "queryError",
        payload: {
          error: {
            message: error.message,
            isCustomQueryError: error instanceof CustomQueryError,
          },
        },
      });
    } else {
      self.postMessage({
        action: "queryError",
        payload: {
          error: { message: "Unknown error", isCustomQueryError: false },
        },
      });
    }
  }
};
