import { useState, useEffect, useCallback } from "react";
import { useDatabaseStore } from "./store/useDatabaseStore";
import { usePanelStore } from "./store/usePanelStore";
import { usePanelManager } from "./providers/PanelProvider";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopBar from "./components/TopBar";
import StructureTab from "@/components/structureTab/StructureTab";
import BrowseTab from "@/components/browseTab/BrowseTab";
import ExecuteTab from "@/components/executeTab/ExecuteTab";

import { LoaderCircleIcon } from "lucide-react";

export default function App() {
  const { isDatabaseLoading } = useDatabaseStore();
  const { dataPanelSize, setSchemaPanelSize, setDataPanelSize, isMobile } =
    usePanelStore();
  const { expandDataPanel } = usePanelManager();

  const [activeTab, setActiveTab] = useState("data");

  // Handles when user changes tabs
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  // Update panel sizes when active tab changes
  useEffect(() => {
    // When switching to execute tab, ensure proper panel sizes
    if (activeTab === "execute" && dataPanelSize <= 0) {
      expandDataPanel();
    }
  }, [activeTab, dataPanelSize, expandDataPanel]);

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-primary/5">
      <TopBar />
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange} // Use memoized callback here
        className="flex-1 flex flex-col"
      >
        <TabsList className="mt-2 bg-primary/5 w-full justify-start border-b rounded-none h-9">
          <TabsTrigger
            id="structure"
            key="structure"
            disabled={isDatabaseLoading}
            value="structure"
            className="text-xs h-8 data-[state=active]: data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Database Structure
          </TabsTrigger>
          <TabsTrigger
            id="data"
            key="data"
            disabled={isDatabaseLoading}
            value="data"
            className="text-xs h-8 data-[state=active]: data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            Browse Data
          </TabsTrigger>
          <TabsTrigger
            disabled={isDatabaseLoading}
            id="execute"
            key="execute"
            value="execute"
            className="text-xs h-8 data-[state=active]: data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            onClick={() => {
              if (isMobile) {
                setDataPanelSize(100);
                setSchemaPanelSize(0);
              }
            }}
          >
            Execute SQL
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 max-h-custom-dvh overflow-hidden">
          <TabsContent value="data" className="h-full m-0 p-0 border-none">
            {isDatabaseLoading ? (
              <LoadingIndicator message="Loading Database" />
            ) : (
              <BrowseTab />
            )}
          </TabsContent>
          <TabsContent value="structure" className="h-full m-0 p-0 border-none">
            <StructureTab />
          </TabsContent>
          <TabsContent
            value="execute"
            className="h-full m-0 p-0 border-none border"
          >
            <ExecuteTab />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}

const LoadingIndicator = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-full">
    <LoaderCircleIcon className="h-4 w-4 mr-2 animate-spin" />
    <span className="text-xl">{message}</span>
  </div>
);
