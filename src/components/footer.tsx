import useSQLiteStore from "../store/useSQLiteStore";

import DarkModeToggle from "../components/dark-mode";
import Settings from "./settings";

import { Github } from "lucide-react";

export default function Footer() {
  const { db } = useSQLiteStore();

  return (
    <footer className="flex items-center justify-between my-1 p-4 border rounded">
      <div>
        <p className="hidden sm:block text-xs">
          No file will be uploaded to server. using JavaScript, sql.js
        </p>
        <p className="block sm:hidden text-xs">No file uploads to server.</p>
        <a
          href="https://github.com/vwh/sqlite-viewer"
          target="_blank"
          className="text-sm text-link hover:underline flex gap-1 items-center"
          title="Star on GitHub"
        >
          <Github className="h-4 w-4" />
          <span>Star us on GitHub</span>
        </a>
      </div>
      <div className="flex gap-1">
        <DarkModeToggle />
        {db && <Settings />}
      </div>
    </footer>
  );
}
