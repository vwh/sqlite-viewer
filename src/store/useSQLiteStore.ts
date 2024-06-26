import { create } from "zustand";

import type { Database, QueryExecResult } from "sql.js";
import type { TableInfo } from "../types";

import { getTableSchema, getTableNames, loadDatabase } from "../lib/sqlite";

interface SQLiteState {
  db: Database | null;
  isLoading: boolean;
  queryError: string | null;
  tables: { name: string; count: number }[];
  selectedTable: string;
  tableSchemas: TableInfo;
  loadDatabase: (file: File) => Promise<void>;
  query: (sql: string) => QueryExecResult[] | [];
  setQueryError: (value: string | null) => void;
  setTables: (tables: { name: string; count: number }[]) => void;
  setSelectedTable: (value: string) => void;
  setTableSchemas: (schemas: TableInfo) => void;
}

const initializeStore = create<SQLiteState>((set, get) => ({
  db: null,
  isLoading: false,
  queryError: null,
  tables: [],
  selectedTable: "0",
  tableSchemas: {},

  loadDatabase: async (file: File) => {
    set({ isLoading: true, queryError: null });

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
      const tables = tablesWithCountsAndSchemas.map(({ name, count }) => ({
        name,
        count,
      }));
      const tableSchemas = tablesWithCountsAndSchemas.reduce(
        (acc, { name, schema }) => {
          acc[name] = schema;
          return acc;
        },
        {} as TableInfo
      );

      set({ tables, tableSchemas, isLoading: false });
    } catch (error) {
      console.error("Failed to load database:", error);
      set({ isLoading: false, queryError: "Failed to load database" });
    }
  },

  query: (sql: string): QueryExecResult[] | [] => {
    const db = get().db;
    if (!db) {
      console.warn("Database is not loaded.");
      return [];
    }
    return db.exec(sql);
  },

  setQueryError: (value: string | null) => set({ queryError: value }),

  setTables: (tables: { name: string; count: number }[]) => set({ tables }),

  setSelectedTable: (value: string) => set({ selectedTable: value }),

  setTableSchemas: (schemas: TableInfo) => set({ tableSchemas: schemas }),
}));

export default initializeStore;
