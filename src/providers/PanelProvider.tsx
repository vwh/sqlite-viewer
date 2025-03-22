import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState
} from "react";
import { usePanelStore } from "@/store/usePanelStore";

import type { SqlValue } from "sql.js";

interface PanelContextProps {
  handleRowClick: (row: SqlValue[], index: number) => void;
  handleInsert: () => void;
  handlePanelReset: () => void;
  isEditing: boolean;
  selectedRowObject: { data: SqlValue[]; index: number } | null;
  isInserting: boolean;
  setIsInserting: (value: boolean) => void;
  setSelectedRowObject: (
    value: { data: SqlValue[]; index: number } | null
  ) => void;
  handleCloseEdit: () => void;
}

const PanelContext = createContext<PanelContextProps | undefined>(undefined);

interface PanelProviderProps {
  children: React.ReactNode;
}

export const PanelProvider = ({ children }: PanelProviderProps) => {
  const setPanelsForDevice = usePanelStore((state) => state.setPanelsForDevice);

  const [selectedRowObject, setSelectedRowObject] = useState<{
    data: SqlValue[];
    index: number;
  } | null>(null);
  const [isInserting, setIsInserting] = useState(false);

  // Detect if in editing mode
  const isEditing = selectedRowObject !== null || isInserting;

  // Set panel sizes when page loads
  useEffect(() => {
    setPanelsForDevice();
  }, [setPanelsForDevice]);

  // Handle row click to toggle edit panel
  const handleRowClick = useCallback((row: SqlValue[], index: number) => {
    setIsInserting(false);
    setSelectedRowObject({ data: row, index: index });
  }, []);

  // Handle insert row button click
  const handleInsert = useCallback(() => {
    setSelectedRowObject(null);
    setIsInserting(true);
  }, []);

  // Handle resetting edit panel
  const handlePanelReset = useCallback(() => {
    setIsInserting(false);
    setSelectedRowObject(null);
  }, []);

  // Handle closing edit panel
  const handleCloseEdit = useCallback(() => {
    setIsInserting(false);
    setSelectedRowObject(null);
  }, []);

  // Switch to execute tab and adjust panels
  // const expandDataPanel = useCallback(() => {
  //   if (usePanelStore.getState().isMobile) {
  //     setDataPanelSize(100);
  //     setSchemaPanelSize(0);
  //   }
  // }, [setDataPanelSize, setSchemaPanelSize]);

  const value = {
    handleRowClick,
    handleInsert,
    handlePanelReset,
    isEditing,
    selectedRowObject,
    isInserting,
    setIsInserting,
    setSelectedRowObject,
    handleCloseEdit
  };

  return (
    <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
  );
};

export const usePanelManager = () => {
  const context = useContext(PanelContext);

  if (context === undefined) {
    throw new Error("usePanelManager must be used within a PanelProvider");
  }

  return context;
};
