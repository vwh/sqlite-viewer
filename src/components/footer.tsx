import ThemeToggle from "./theme-toggle";
import { Github } from "lucide-react";

export const REPO = "https://github.com/vwh/sqlite-viewer";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between p-4 border rounded">
      <div>
        <p className="hidden sm:block text-xs">
          No file will be uploaded to server. using JavaScript, sql.js
        </p>
        <p className="block sm:hidden text-xs">No file uploads to server.</p>
        <a
          href={REPO}
          target="_blank"
          className="text-sm text-link hover:underline flex gap-1 items-center"
          title="Star on GitHub"
        >
          <Github className="h-4 w-4" />
          <span>Star us on GitHub</span>
        </a>
      </div>
      <div className="flex gap-1">
        <ThemeToggle />
      </div>
    </footer>
  );
}
