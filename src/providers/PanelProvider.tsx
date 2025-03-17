import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from "react";
import { usePanelStore } from "@/store/usePanelStore";

import type { SqlValue } from "sql.js";

interface PanelContextProps {
  handleRowClick: (row: SqlValue[], index: number) => void;
  handleInsert: () => void;
  handlePanelReset: () => void;
  isEditing: boolean;
  selectedRowData: { data: SqlValue[]; index: number } | null;
  isInserting: boolean;
  setIsInserting: (value: boolean) => void;
  setSelectedRowData: (
    value: { data: SqlValue[]; index: number } | null
  ) => void;
  goBackToData: () => void;
  expandDataPanel: () => void;
}

const PanelContext = createContext<PanelContextProps | undefined>(undefined);

interface PanelProviderProps {
  children: React.ReactNode;
}

export const PanelProvider = ({ children }: PanelProviderProps) => {
  const {
    setPanelsForDevice,
    setTopPanelSize,
    setBottomPanelSize,
    setSchemaPanelSize,
    setDataPanelSize,
    isMobile,
  } = usePanelStore();

  const [selectedRowData, setSelectedRowData] = useState<{
    data: SqlValue[];
    index: number;
  } | null>(null);
  const [isInserting, setIsInserting] = useState(false);

  // Detect if in editing mode
  const isEditing = selectedRowData !== null || isInserting;

  // Set panel sizes when page loads
  useEffect(() => {
    setPanelsForDevice();
  }, [setPanelsForDevice]);

  // Handle row click to toggle edit panel
  const handleRowClick = useCallback(
    (row: SqlValue[], index: number) => {
      setIsInserting(false);
      setSelectedRowData({ data: row, index: index });

      if (isMobile) {
        setTopPanelSize(100);
        setBottomPanelSize(0);
        setDataPanelSize(0);
        setSchemaPanelSize(100);
      } else {
        setTopPanelSize(75);
        setBottomPanelSize(25);
      }
    },
    [
      isMobile,
      setBottomPanelSize,
      setDataPanelSize,
      setSchemaPanelSize,
      setTopPanelSize,
    ]
  );

  // Handle insert row button click
  const handleInsert = useCallback(() => {
    setSelectedRowData(null);
    setIsInserting(true);

    if (isMobile) {
      setTopPanelSize(100);
      setBottomPanelSize(0);
      setDataPanelSize(0);
      setSchemaPanelSize(100);
    } else {
      setTopPanelSize(75);
      setBottomPanelSize(25);
    }
  }, [
    isMobile,
    setBottomPanelSize,
    setDataPanelSize,
    setSchemaPanelSize,
    setTopPanelSize,
  ]);

  // Handle resetting edit panel
  const handlePanelReset = useCallback(() => {
    setIsInserting(false);
    setSelectedRowData(null);
  }, []);

  // Go back to data view on mobile
  const goBackToData = useCallback(() => {
    setIsInserting(false);
    setSelectedRowData(null);
    setTopPanelSize(0);
    setBottomPanelSize(100);
    setDataPanelSize(100);
    setSchemaPanelSize(0);
  }, [
    setTopPanelSize,
    setBottomPanelSize,
    setDataPanelSize,
    setSchemaPanelSize,
  ]);

  // Switch to execute tab and adjust panels
  const expandDataPanel = useCallback(() => {
    if (isMobile) {
      setDataPanelSize(100);
      setSchemaPanelSize(0);
    }
  }, [isMobile, setDataPanelSize, setSchemaPanelSize]);

  const value = {
    handleRowClick,
    handleInsert,
    handlePanelReset,
    isEditing,
    selectedRowData,
    isInserting,
    setIsInserting,
    setSelectedRowData,
    goBackToData,
    expandDataPanel,
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
