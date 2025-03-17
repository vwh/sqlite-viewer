import { useMemo } from "react";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ModeToggle } from "./theme/modeToggle";

import { DatabaseIcon, SaveIcon } from "lucide-react";

const TopBar = () => {
  const { handleFileChange, handleDownload } = useDatabaseWorker();

  const topBar = useMemo(
    () => (
      <header className="flex items-center justify-between gap-1 p-1 border-b">
        <section className="flex items-center gap-1">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer w-full"
          >
            <Input
              id="file-upload"
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <Button size="sm" variant="outline" className="text-xs w-full">
              <DatabaseIcon className="h-3 w-3" />
              Open Database
            </Button>
          </label>
          <Button
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={handleDownload}
            title="Save the database"
          >
            <SaveIcon className="h-3 w-3" />
            Save Database
          </Button>
        </section>
        <ModeToggle />
      </header>
    ),
    [handleFileChange, handleDownload]
  );

  return topBar;
};

export default TopBar;
