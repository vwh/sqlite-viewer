import { useDatabaseStore } from "./store/useDatabaseStore";
import { usePanelStore } from "./store/usePanelStore";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopBar from "./components/TopBar";
import StructureTab from "@/components/structureTab/StructureTab";
import BrowseTab from "@/components/browseTab/BrowseTab";
import ExecuteTab from "@/components/executeTab/ExecuteTab";

import { LoaderCircleIcon } from "lucide-react";

export default function App() {
  const isDatabaseLoading = useDatabaseStore(
    (state) => state.isDatabaseLoading
  );
  const setSchemaPanelSize = usePanelStore((state) => state.setSchemaPanelSize);
  const setDataPanelSize = usePanelStore((state) => state.setDataPanelSize);

  return (
    <main className="bg-primary/5 flex h-screen flex-col overflow-hidden">
      <TopBar />
      <Tabs defaultValue="data" className="flex flex-1 flex-col">
        <TabsList className="bg-primary/5 mt-2 h-9 w-full justify-start rounded-none border-b">
          <TabsTrigger
            id="structure"
            key="structure"
            disabled={isDatabaseLoading}
            value="structure"
            className="data-[state=active]: data-[state=active]:border-primary h-8 rounded-none text-xs data-[state=active]:border-b-2"
          >
            Database Structure
          </TabsTrigger>
          <TabsTrigger
            id="data"
            key="data"
            disabled={isDatabaseLoading}
            value="data"
            className="data-[state=active]: data-[state=active]:border-primary h-8 rounded-none text-xs data-[state=active]:border-b-2"
          >
            Browse Data
          </TabsTrigger>
          <TabsTrigger
            disabled={isDatabaseLoading}
            id="execute"
            key="execute"
            value="execute"
            className="data-[state=active]: data-[state=active]:border-primary h-8 rounded-none text-xs data-[state=active]:border-b-2"
            onClick={() => {
              if (usePanelStore.getState().isMobile) {
                setDataPanelSize(100);
                setSchemaPanelSize(0);
              }
            }}
          >
            Execute SQL
          </TabsTrigger>
        </TabsList>

        <div className="max-h-custom-dvh flex-1 overflow-hidden">
          <TabsContent value="data" className="m-0 h-full border-none p-0">
            {isDatabaseLoading ? (
              <LoadingIndicator message="Loading Database" />
            ) : (
              <BrowseTab />
            )}
          </TabsContent>
          <TabsContent value="structure" className="m-0 h-full border-none p-0">
            <StructureTab />
          </TabsContent>
          <TabsContent
            value="execute"
            className="m-0 h-full border border-none p-0"
          >
            <ExecuteTab />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}

const LoadingIndicator = ({ message }: { message: string }) => (
  <div className="flex h-full items-center justify-center">
    <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
    <span className="text-xl">{message}</span>
  </div>
);
