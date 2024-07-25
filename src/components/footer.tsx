import ThemeToggle from "./theme-toggle";
import { Github } from "lucide-react";

export const REPO = "https://github.com/vwh/sqlite-viewer";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between rounded border p-4">
      <div>
        <p className="hidden text-xs sm:block">
          No file will be uploaded to server. using JavaScript, sql.js
        </p>
        <p className="block text-xs sm:hidden">No file uploads to server.</p>
        <a
          href={REPO}
          target="_blank"
          className="flex items-center gap-1 text-sm text-link hover:underline"
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
