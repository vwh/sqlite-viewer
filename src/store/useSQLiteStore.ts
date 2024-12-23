import { create } from "zustand";
import type { Database, QueryExecResult } from "sql.js";
import type { TableInfo } from "@/types";

import { getTableSchema, getTableNames, loadDatabaseBytes } from "@/lib/sqlite";
import { formatFileSize } from "@/lib/file";

type OrderDirection = "ASC" | "DESC";

interface SQLiteState {
  db: Database | null;
  loadDatabaseBytes: (bytes: Uint8Array) => Promise<void>;
  isLoading: boolean;

  tables: { name: string; count: number }[];
  setTables: (tables: { name: string; count: number }[]) => void;
  selectedTable: string;
  setSelectedTable: (value: string) => void;

  tableSchemas: TableInfo;

  query: (sql: string) => QueryExecResult[] | [];
  queryError: string | null;
  setQueryError: (value: string | null) => void;

  rowPerPageOrAuto: number | "auto";
  setRowPerPageOrAuto: (value: number | "auto") => void;

  customQuery: string;
  setCustomQuery: (value: string) => void;
  isCustomQuery: boolean;
  setIsCustomQuery: (value: boolean) => void;

  queryHistory: string[];
  unShiftToQueryHistory: (value: string) => void;

  expandPage: boolean;
  setExpandPage: (value: boolean) => void;

  dateFormatValue: string;
  setDateFormatValue: (value: string) => void;

  filters: {
    [columnName: string]: string;
  };
  setFilters: (value: { [columnName: string]: string }) => void;
  appendToFilters: (columnName: string, value: string) => void;
  filtersNeedClear: boolean;
  setFiltersNeedClear: (value: boolean) => void;

  totalRows: number;
  setTotalRows: (value: number) => void;

  orderBy: {
    column: string | null;
    direction: OrderDirection;
  };
  setOrderBy: (column: string | null, direction: OrderDirection) => void;

  databaseData: { name: string; size: number; sizeAsString: string };
  setDatabaseData: (value: { name: string; size: number }) => void;
}

const initializeStore = create<SQLiteState>((set, get) => ({
  db: null,
  isLoading: false,

  loadDatabaseBytes: async (bytes: Uint8Array) => {
    set({ isLoading: true });
    try {
      const database = await loadDatabaseBytes(bytes);
      const tableNames = getTableNames(database);
      const tableCountsAndSchemas = await Promise.all(
        tableNames.map(async (name) => {
          const countResult = database.exec(`SELECT COUNT(*) FROM "${name}"`);
          const count = Number.parseInt(
            countResult[0].values[0][0] as string,
            10
          );
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
      set({ isLoading: false });
      throw error;
    }
  },

  tables: [],
  setTables: (tables: { name: string; count: number }[]) => set({ tables }),
  selectedTable: "0",
  setSelectedTable: (value: string) => set({ selectedTable: value }),

  tableSchemas: {},

  customQuery: "",
  setIsCustomQuery: (value: boolean) => set({ isCustomQuery: value }),
  setCustomQuery: (value: string) => set({ customQuery: value }),
  isCustomQuery: false,
  queryError: null,
  setQueryError: (value: string | null) => set({ queryError: value }),
  query: (sql: string): QueryExecResult[] | [] => {
    const { db } = get();
    if (!db) {
      console.warn("Database is not loaded.");
      return [];
    }
    return db.exec(sql);
  },

  rowPerPageOrAuto: "auto",
  setRowPerPageOrAuto: (value: number | "auto") =>
    set({ rowPerPageOrAuto: value }),

  queryHistory: [],
  unShiftToQueryHistory: (value: string) =>
    set((state) => ({ queryHistory: [value, ...state.queryHistory] })),

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
  filtersNeedClear: false,
  setFiltersNeedClear: (value: boolean) => set({ filtersNeedClear: value }),

  totalRows: 0,
  setTotalRows: (value: number) => set({ totalRows: value }),

  orderBy: {
    column: null,
    direction: "ASC"
  },
  setOrderBy: (column: string | null, direction: OrderDirection) =>
    set({ orderBy: { column, direction } }),

  databaseData: { name: "database.db", size: 0, sizeAsString: "0 Bytes" },
  setDatabaseData: (value: { name: string; size: number }) => {
    set({
      databaseData: { ...value, sizeAsString: formatFileSize(value.size) }
    });
  }
}));

export default initializeStore;
