import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/theme/ModeToggle";

import { DatabaseIcon, SaveIcon } from "lucide-react";

const TopBar = () => {
  const { handleFileChange, handleDownload } = useDatabaseWorker();

  return (
    <header className="flex items-center justify-between gap-1 border-b p-1">
      <section className="flex w-full items-center gap-1">
        <label
          htmlFor="file-upload"
          className="relative w-full cursor-pointer md:w-[300px]"
        >
          <Input
            id="file-upload"
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleFileChange}
          />
          <Button size="sm" variant="outline" className="w-full text-xs">
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
  );
};

export default TopBar;
