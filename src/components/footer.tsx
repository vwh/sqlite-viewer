import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="z-[100]">
      <p className="hidden sm:block text-xs mt-2">
        No file will be uploaded to server. using JavaScript, sql.js
      </p>
      <p className="block sm:hidden text-xs mt-2">
        No file will be uploaded to server.
      </p>
      <a
        href="https://github.com/vwh/sqlite-viewer"
        target="_blank"
        className="text-sm text-[#003B57] hover:underline flex gap-1 items-center"
        title="Star on GitHub"
      >
        <Github className="h-4 w-4 mt-1" />
        <span>Star this project on GitHub</span>
      </a>
    </footer>
  );
}
