import { create } from "zustand";
import { debounce } from "lodash";
import type { SqlValue } from "sql.js";

interface PanelState {
  schemaPanelSize: number;
  dataPanelSize: number;
  query: string;
  editValues: string[];
  selectedRow: { data: SqlValue[]; index: number } | null;
  isInserting: boolean;
  isMobile: boolean;

  setSchemaPanelSize: (size: number) => void;
  setDataPanelSize: (size: number) => void;
  setQuery: (query: string) => void;
  setEditValues: (values: string[]) => void;
  setSelectedRow: (row: { data: SqlValue[]; index: number } | null) => void;
  setIsInserting: (inserting: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  resetEditSection: () => void;
  setPanelsForDevice: () => void;
}

export const usePanelStore = create<PanelState>((set, get) => {
  const debouncedSetSchemaPanelSize = debounce((size: number) => {
    set({ schemaPanelSize: size });
  }, 200);

  const debouncedSetDataPanelSize = debounce((size: number) => {
    set({ dataPanelSize: size });
  }, 200);

  return {
    schemaPanelSize: 0,
    dataPanelSize: 100,
    topPanelSize: 0,
    bottomPanelSize: 100,
    query: "",
    editValues: [],
    selectedRow: null,
    isInserting: false,
    isMobile: window.matchMedia("(max-width: 768px)").matches,

    // Use the debounced/throttled setters here
    setSchemaPanelSize: debouncedSetSchemaPanelSize,
    setDataPanelSize: debouncedSetDataPanelSize,

    setQuery: (query) => set({ query }),
    setEditValues: (values) => set({ editValues: values }),
    setSelectedRow: (row) => set({ selectedRow: row }),
    setIsInserting: (inserting) => set({ isInserting: inserting }),
    setIsMobile: (isMobile) => set({ isMobile }),

    resetEditSection: () =>
      set(() => {
        const updates: Partial<PanelState> = {
          isInserting: false,
          selectedRow: null
        };
        return updates;
      }),

    setPanelsForDevice: () =>
      set(() => {
        const isMobile = get().isMobile;
        return isMobile
          ? { schemaPanelSize: 0, dataPanelSize: 100 }
          : { schemaPanelSize: 25, dataPanelSize: 75 };
      })
  };
});
