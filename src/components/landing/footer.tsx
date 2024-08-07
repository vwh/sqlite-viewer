import ThemeModeToggle from "@/components/settings/theme-mode-toggle";
import { GithubIcon } from "lucide-react";

export const REPO = "https://github.com/vwh/sqlite-viewer";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t-2 bg-background shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 md:py-6">
          <div className="flex flex-col gap-1">
            <div>
              <p className="text-sms hidden sm:block">
                No file will be uploaded to server. Using JavaScript, sql.js
              </p>
              <p className="text-sm sm:hidden">No file uploads to server.</p>
            </div>
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-500 transition-colors dark:text-blue-400"
              title="Star on GitHub"
            >
              <GithubIcon className="h-5 w-5" />
              <span className="text-sm font-medium hover:underline">
                Star us on GitHub
              </span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
