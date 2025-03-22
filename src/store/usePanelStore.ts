import { create } from "zustand";
import { debounce, throttle } from "lodash";
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
  isMobile: boolean;

  setSchemaPanelSize: (size: number) => void;
  setDataPanelSize: (size: number) => void;
  setTopPanelSize: (size: number) => void;
  setBottomPanelSize: (size: number) => void;
  setQuery: (query: string) => void;
  setEditValues: (values: string[]) => void;
  setSelectedRow: (row: { data: SqlValue[]; index: number } | null) => void;
  setIsInserting: (inserting: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  resetEditSection: () => void;
  setPanelsForDevice: () => void;
}

export const usePanelStore = create<PanelState>((set, get) => {
  // Create debounced functions for panels that may have more noisy updates
  const debouncedSetSchemaPanelSize = debounce((size: number) => {
    set({ schemaPanelSize: size });
  }, 200);

  const debouncedSetDataPanelSize = debounce((size: number) => {
    set({ dataPanelSize: size });
  }, 200);

  // Use throttle to ensure updates are limited during continuous events
  const throttledSetTopPanelSize = throttle((size: number) => {
    set({ topPanelSize: size });
  }, 200);

  const throttledSetBottomPanelSize = throttle((size: number) => {
    set({ bottomPanelSize: size });
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
    setTopPanelSize: throttledSetTopPanelSize,
    setBottomPanelSize: throttledSetBottomPanelSize,

    setQuery: (query) => set({ query }),
    setEditValues: (values) => set({ editValues: values }),
    setSelectedRow: (row) => set({ selectedRow: row }),
    setIsInserting: (inserting) => set({ isInserting: inserting }),
    setIsMobile: (isMobile) => set({ isMobile }),

    resetEditSection: () =>
      set(() => {
        const isMobile = get().isMobile;
        const updates: Partial<PanelState> = {
          isInserting: false,
          selectedRow: null,
          topPanelSize: 0,
          bottomPanelSize: 100
        };
        if (isMobile) {
          updates.schemaPanelSize = 0;
          updates.dataPanelSize = 100;
        }
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
