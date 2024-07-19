import { create } from "zustand";
import type { Database, QueryExecResult } from "sql.js";
import type { TableInfo } from "@/types";

import {
  getTableSchema,
  getTableNames,
  loadDatabase,
  exportDatabase,
  exportTableAsCSV,
  exportAllTablesAsCSV,
} from "@/lib/sqlite";

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
  rowPerPageOrAuto: number | "auto";
  setRowPerPageOrAuto: (value: number | "auto") => void;
  downloadDatabase: () => void;
  exportTableAsCSV: (tableIndex: number) => void;
  exportAllTablesAsCSV: () => { [tableName: string]: void };
  isCustomQuery: boolean;
  setIsCustomQuery: (value: boolean) => void;
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

  rowPerPageOrAuto: "auto",
  setRowPerPageOrAuto: (value: number | "auto") =>
    set({ rowPerPageOrAuto: value }),

  downloadDatabase: () => {
    const db = get().db;
    if (db) {
      const binaryArray = exportDatabase(db);
      const blob = new Blob([binaryArray], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "database.sqlite";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.warn("Database is not loaded.");
    }
  },

  exportTableAsCSV: (tableIndex: number): void => {
    const db = get().db;
    if (db) {
      exportTableAsCSV(db, tableIndex);
    } else {
      console.warn("Database is not loaded.");
    }
  },

  exportAllTablesAsCSV: (): { [tableName: string]: void } => {
    const db = get().db;
    if (db) {
      exportAllTablesAsCSV(db);
      return {};
    } else {
      console.warn("Database is not loaded.");
      return {};
    }
  },

  isCustomQuery: false,
  setIsCustomQuery: (value: boolean) => set({ isCustomQuery: value }),
}));

export default initializeStore;
