import { create } from "zustand";
import type { SqlValue } from "sql.js";

interface PanelState {
  schemaPanelSize: number;
  dataPanelSize: number;
  topPanelSize: number;
  bottomPanelSize: number;

  query: string;

  editValues: string[];
  selectedRow: { data: SqlValue[]; index: number } | null;
  isInserting: boolean;

  setSchemaPanelSize: (size: number) => void;
  setDataPanelSize: (size: number) => void;
  setTopPanelSize: (size: number) => void;
  setBottomPanelSize: (size: number) => void;
  setQuery: (query: string) => void;
  setEditValues: (values: string[]) => void;
  setSelectedRow: (row: { data: SqlValue[]; index: number } | null) => void;
  setIsInserting: (inserting: boolean) => void;

  resetEditSection: (isMobile: boolean) => void;
  setPanelsForDevice: (isMobile: boolean) => void;
}

export const usePanelStore = create<PanelState>((set) => ({
  // Initial state
  schemaPanelSize: 0,
  dataPanelSize: 100,
  topPanelSize: 0,
  bottomPanelSize: 100,
  query: "",
  editValues: [],
  selectedRow: null,
  isInserting: false,

  setSchemaPanelSize: (size) => set({ schemaPanelSize: size }),
  setDataPanelSize: (size) => set({ dataPanelSize: size }),
  setTopPanelSize: (size) => set({ topPanelSize: size }),
  setBottomPanelSize: (size) => set({ bottomPanelSize: size }),
  setQuery: (query) => set({ query }),
  setEditValues: (values) => set({ editValues: values }),
  setSelectedRow: (row) => set({ selectedRow: row }),
  setIsInserting: (inserting) => set({ isInserting: inserting }),

  resetEditSection: (isMobile: boolean) =>
    set(() => {
      const updates: Partial<PanelState> = {
        isInserting: false,
        selectedRow: null,
        topPanelSize: 0,
        bottomPanelSize: 100,
      };
      if (isMobile) {
        updates.schemaPanelSize = 0;
        updates.dataPanelSize = 100;
      }
      return updates;
    }),

  setPanelsForDevice: (isMobile: boolean) =>
    set(() => {
      if (!isMobile) {
        return {
          schemaPanelSize: 25,
          dataPanelSize: 75,
        };
      }
      return {
        schemaPanelSize: 0,
        dataPanelSize: 100,
      };
    }),
}));
