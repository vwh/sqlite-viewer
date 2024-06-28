import { create } from "zustand";

import type { Database, QueryExecResult } from "sql.js";
import { getTableSchema, getTableNames, loadDatabase } from "../lib/sqlite";

interface TableInfo {
  [key: string]: {
    [columnName: string]: {
      type: string;
      isPrimaryKey: boolean;
      isForeignKey: boolean;
    };
  };
}

interface SQLiteState {
  db: Database | null;
  loadDatabase: (file: File) => Promise<void>;
  query: (sql: string) => QueryExecResult[] | [];
  queryError: string | null;
  setQueryError: (value: string | null) => void;
  tables: { name: string; count: number }[];
  setTables: (tables: { name: string; count: number }[]) => void;
  selectedTable: string;
  setSelectedTable: (value: string) => void;
  isLoading: boolean;
  tableSchemas: TableInfo;
  setTableSchemas: (schemas: TableInfo) => void;
}

const initializeStore = create<SQLiteState>((set, get) => ({
  db: null,
  isLoading: false,

  loadDatabase: async (file: File) => {
    set({ isLoading: true });
    try {
      const database = await loadDatabase(file);
      set({ db: database });

      const tableNames = getTableNames(database);

      const tableCountsPromises = tableNames.map(async (tableName) => {
        const countResult = database.exec(
          `SELECT COUNT(*) FROM "${tableName}"`
        );
        const count = parseInt(countResult[0].values[0][0] as string, 10);
        const schema = await getTableSchema(database, tableName);
        return { name: tableName, count, schema };
      });

      const tablesWithCountsAndSchemas = await Promise.all(tableCountsPromises);
      set({
        tables: tablesWithCountsAndSchemas.map(({ name, count }) => ({
          name,
          count,
        })),
        tableSchemas: tablesWithCountsAndSchemas.reduce(
          (acc, { name, schema }) => {
            acc[name] = schema;
            return acc;
          },
          {} as TableInfo
        ),
      });
    } catch (error) {
      console.error("Failed to load database:", error);
    }
    set({ isLoading: false });
  },

  query: (sql: string): QueryExecResult[] | [] => {
    const db = get().db;
    if (!db) {
      console.warn("Database is not loaded.");
      return [];
    }
    return db.exec(sql);
  },

  tables: [],
  setTables: (tables: { name: string; count: number }[]) => set({ tables }),

  selectedTable: "0",
  setSelectedTable: (value: string) => set({ selectedTable: value }),

  tableSchemas: {},
  setTableSchemas: (schemas: TableInfo) => set({ tableSchemas: schemas }),

  queryError: null,
  setQueryError: (value: string | null) => set({ queryError: value }),
}));

export default initializeStore;
