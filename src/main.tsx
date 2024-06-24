import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Github } from "lucide-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="container mx-auto p-4">
      <App />
      <section className="z-10">
        <p className="text-xs mt-2">
          No file will be uploaded to server. using JavaScript, sql.js
        </p>
        <a
          href="https://github.com/vwh/sqlite-viewer"
          target="_blank"
          className="text-sm text-[#003B57] hover:underline flex gap-1 items-center"
        >
          <Github className="h-4 w-4 mt-1" />
          <span>Star this project on GitHub</span>
        </a>
      </section>
    </main>
  </React.StrictMode>
);
