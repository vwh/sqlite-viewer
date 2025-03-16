import { create } from "zustand";
import type { TableSchema } from "@/types";

interface SchemaState {
  expandedTables: string[];
  expandedTableSection: boolean;
  toggleTable: (tableName: string) => void;
  toggleTableSection: () => void;
  expandAllTables: (tableSchema: TableSchema) => void;
  collapseAllTables: () => void;

  expandedIndexSection: boolean;
  toggleIndexSection: () => void;

  resetState: () => void;
}

export const useSchemaStore = create<SchemaState>((set) => ({
  expandedTables: [],
  expandedIndexes: [],
  expandedTableSection: true, // Tables section expanded by default
  expandedIndexSection: true, // Indexes section expanded by default

  toggleTable: (tableName: string) =>
    set((state) => ({
      expandedTables: state.expandedTables.includes(tableName)
        ? state.expandedTables.filter((name) => name !== tableName)
        : [...state.expandedTables, tableName],
    })),

  toggleTableSection: () =>
    set((state) => ({
      expandedTableSection: !state.expandedTableSection,
    })),

  toggleIndexSection: () =>
    set((state) => ({
      expandedIndexSection: !state.expandedIndexSection,
    })),

  expandAllTables: (tableSchema: TableSchema) =>
    set({
      expandedTables: Object.keys(tableSchema),
    }),

  collapseAllTables: () =>
    set({
      expandedTables: [],
    }),

  resetState: () =>
    set({
      expandedTables: [],
      expandedTableSection: true,
      expandedIndexSection: true,
    }),
}));
