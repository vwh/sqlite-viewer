import { create } from "zustand";
import type { TableSchema, IndexSchema, Filters, Sorters } from "@/types";
import type { SqlValue } from "sql.js";

interface DatabaseState {
  tablesSchema: TableSchema;
  indexesSchema: IndexSchema[];
  currentTable: string | null;

  data: SqlValue[][] | null;
  columns: string[] | null;
  maxSize: number;

  isDatabaseLoading: boolean;
  isDataLoading: boolean;
  errorMessage: string | null;

  filters: Filters | null;
  sorters: Sorters | null;
  limit: number;
  offset: number;

  customQuery?: string;
  customQueryObject: {
    data: SqlValue[][];
    columns: string[];
  } | null;

  setTablesSchema: (schema: TableSchema) => void;
  setIndexesSchema: (schema: IndexSchema[]) => void;
  setCurrentTable: (table: string | null) => void;
  setData: (data: SqlValue[][] | null) => void;
  setColumns: (columns: string[] | null) => void;
  setMaxSize: (size: number) => void;
  setIsDatabaseLoading: (loading: boolean) => void;
  setIsDataLoading: (loading: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  setFilters: (filters: Filters | null) => void;
  setSorters: (sorters: Sorters | null) => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;

  setCustomQuery: (query: string) => void;
  setCustomQueryObject: (
    obj: { data: SqlValue[][]; columns: string[] } | null
  ) => void;

  resetPagination: () => void;
  resetFiltersAndSorters: () => void;
}

export const useDatabaseStore = create<DatabaseState>((set) => ({
  tablesSchema: {} as TableSchema,
  indexesSchema: [],
  currentTable: null,
  data: null,
  columns: null,
  maxSize: 1,
  isDatabaseLoading: false,
  isDataLoading: false,
  errorMessage: null,
  filters: null,
  sorters: null,
  limit: 50,
  offset: 0,

  customQuery: undefined,
  customQueryObject: null,

  setTablesSchema: (schema: TableSchema) => set({ tablesSchema: schema }),
  setIndexesSchema: (schema: IndexSchema[]) => set({ indexesSchema: schema }),
  setCurrentTable: (table: string | null) => set({ currentTable: table }),
  setData: (data: SqlValue[][] | null) => set({ data }),
  setColumns: (columns: string[] | null) => set({ columns }),
  setMaxSize: (maxSize: number) => set({ maxSize }),
  setIsDatabaseLoading: (isDatabaseLoading: boolean) =>
    set({ isDatabaseLoading }),
  setIsDataLoading: (isDataLoading: boolean) => set({ isDataLoading }),
  setErrorMessage: (errorMessage: string | null) => set({ errorMessage }),
  setFilters: (filters: Filters | null) => set({ filters }),
  setSorters: (sorters: Sorters | null) => set({ sorters }),
  setLimit: (limit: number) => set({ limit }),
  setOffset: (offset: number) => set({ offset }),

  setCustomQuery: (query: string) => set({ customQuery: query }),
  setCustomQueryObject: (
    customQueryObject: { data: SqlValue[][]; columns: string[] } | null
  ) => set({ customQueryObject }),

  resetPagination: () => set({ offset: 0 }),
  resetFiltersAndSorters: () => set({ filters: null, sorters: null }),
}));
