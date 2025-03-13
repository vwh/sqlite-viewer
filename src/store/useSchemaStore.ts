import { create } from "zustand";
import type { TableSchema, IndexSchema } from "@/types";

interface SchemaState {
  expandedTables: string[];
  expandedIndexes: string[];
  expandedTableSection: boolean;
  expandedIndexSection: boolean;
  toggleTable: (tableName: string) => void;
  toggleIndex: (indexName: string) => void;
  toggleTableSection: () => void;
  toggleIndexSection: () => void;
  expandAllTables: (tableSchema: TableSchema) => void;
  collapseAllTables: () => void;
  expandAllIndexes: (indexSchema: IndexSchema[]) => void;
  collapseAllIndexes: () => void;
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

  toggleIndex: (indexName: string) =>
    set((state) => ({
      expandedIndexes: state.expandedIndexes.includes(indexName)
        ? state.expandedIndexes.filter((name) => name !== indexName)
        : [...state.expandedIndexes, indexName],
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

  expandAllIndexes: (indexSchema: IndexSchema[]) =>
    set({
      expandedIndexes: indexSchema.map((index) => index.name),
    }),

  collapseAllIndexes: () =>
    set({
      expandedIndexes: [],
    }),

  resetState: () =>
    set({
      expandedTables: [],
      expandedIndexes: [],
      expandedTableSection: true,
      expandedIndexSection: true,
    }),
}));
