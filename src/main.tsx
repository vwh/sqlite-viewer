import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import { Toaster } from "@/components/ui/sonner";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="container mx-auto p-4 h-screen flex flex-col gap-3">
      <App />
    </main>
    <Toaster />
  </React.StrictMode>,
);
