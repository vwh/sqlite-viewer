// sqlWorker.ts
import Sqlite from "./lib/sqlite";

let instance: Sqlite | null = null;

interface WorkerEvent {
  action: string;
  payload?: any;
}

self.onmessage = async (event: MessageEvent<WorkerEvent>) => {
  const { action, payload } = event.data;

  try {
    switch (action) {
      case "init": {
        // Create a new database instance.
        instance = await Sqlite.create();
        self.postMessage({
          action: "initComplete",
          payload: {
            tables: instance.tables,
            schema: Array.from(instance.schema.entries()),
            currentTable: instance.tables[0],
          },
        });
        break;
      }
      case "openFile": {
        // Open the database from the uploaded file.
        instance = await Sqlite.open(new Uint8Array(payload.file));
        self.postMessage({
          action: "initComplete",
          payload: {
            tables: instance.tables,
            schema: Array.from(instance.schema.entries()),
            currentTable: instance.tables[0],
          },
        });
        break;
      }
      case "exec": {
        // Execute a SQL query (could be multiple statements).
        if (instance) {
          const [results, doTablesChanged] = instance.exec(payload.query);
          // If the structure changed, update tables and schema.
          if (doTablesChanged) {
            self.postMessage({
              action: "updateInstance",
              payload: {
                tables: instance.tables,
                schema: Array.from(instance.schema.entries()),
              },
            });
          }
          self.postMessage({ action: "queryComplete", payload: { results } });
        }
        break;
      }
      case "getTableData": {
        // Retrieve paginated data for a table.
        if (instance) {
          const { currentTable, page, filters, sorters } = payload;
          const [results, maxSize] = instance.getTableData(
            currentTable,
            page,
            filters,
            sorters
          );
          self.postMessage({
            action: "queryComplete",
            payload: { results, maxSize },
          });
        }
        break;
      }
      default:
        console.warn("Unknown worker action:", action);
    }
  } catch (error) {
    if (error instanceof Error)
      self.postMessage({
        action: "queryError",
        payload: { error: error.message },
      });
    else
      self.postMessage({
        action: "queryError",
        payload: { error: "Unknown error" },
      });
  }
};
