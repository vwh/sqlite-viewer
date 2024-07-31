import { create } from "zustand";
import type { Database, QueryExecResult } from "sql.js";
import type { TableInfo } from "@/types";

import { getTableSchema, getTableNames, loadDatabase } from "@/lib/sqlite";

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
  customQuery: string;
  setCustomQuery: (value: string) => void;
  isCustomQuery: boolean;
  setIsCustomQuery: (value: boolean) => void;
  queryHestory: string[];
  setQueryHestory: (value: string[]) => void;
  unShiftToQueryHestory: (value: string) => void;
  expandPage: boolean;
  setExpandPage: (value: boolean) => void;
  dateFormatValue: string;
  setDateFormatValue: (value: string) => void;
  filters: {
    [columnName: string]: string;
  };
  setFilters: (value: { [columnName: string]: string }) => void;
  appendToFilters: (columnName: string, value: string) => void;

  totalRows: number;
  setTotalRows: (value: number) => void;
}

const initializeStore = create<SQLiteState>((set, get) => ({
  db: null,
  isLoading: false,
  queryError: null,
  tables: [],
  selectedTable: "0",
  tableSchemas: {},
  rowPerPageOrAuto: "auto",
  isCustomQuery: false,

  loadDatabase: async (file: File) => {
    set({ isLoading: true, queryError: null });

    try {
      const database = await loadDatabase(file);
      const tableNames = getTableNames(database);

      const tableCountsAndSchemas = await Promise.all(
        tableNames.map(async (name) => {
          const countResult = database.exec(`SELECT COUNT(*) FROM "${name}"`);
          const count = parseInt(countResult[0].values[0][0] as string, 10);
          const schema = await getTableSchema(database, name);
          return { name, count, schema };
        })
      );

      const tables = tableCountsAndSchemas.map(({ name, count }) => ({
        name,
        count
      }));
      const tableSchemas = tableCountsAndSchemas.reduce(
        (acc, { name, schema }) => {
          acc[name] = schema;
          return acc;
        },
        {} as TableInfo
      );

      set({ db: database, tables, tableSchemas, isLoading: false });
    } catch (error) {
      console.error("Failed to load database:", error);
      set({ isLoading: false, queryError: "Failed to load database" });
    }
  },

  query: (sql: string): QueryExecResult[] | [] => {
    const { db } = get();
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
  setRowPerPageOrAuto: (value: number | "auto") =>
    set({ rowPerPageOrAuto: value }),

  customQuery: "",
  setIsCustomQuery: (value: boolean) => set({ isCustomQuery: value }),
  setCustomQuery: (value: string) => set({ customQuery: value }),

  queryHestory: [],
  setQueryHestory: (value: string[]) => set({ queryHestory: value }),
  unShiftToQueryHestory: (value: string) =>
    set((state) => ({ queryHestory: [value, ...state.queryHestory] })),

  expandPage: false,
  setExpandPage: (value: boolean) => set({ expandPage: value }),

  dateFormatValue: "formatDateFormatted",
  setDateFormatValue: (value: string) => set({ dateFormatValue: value }),

  filters: {},
  setFilters: (value: { [columnName: string]: string }) =>
    set({ filters: value }),
  appendToFilters: (columnName: string, value: string) =>
    set((state) => ({
      filters: { ...state.filters, [columnName]: value }
    })),

  totalRows: 0,
  setTotalRows: (value: number) => set({ totalRows: value })
}));

export default initializeStore;
