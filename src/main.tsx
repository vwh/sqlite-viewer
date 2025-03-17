import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/themeProvider.tsx";
import App from "./App.tsx";

import "./index.css";
import { DatabaseWorkerProvider } from "./providers/DatabaseWorkerProvider.tsx";
import { PanelProvider } from "./providers/PanelProvider.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <PanelProvider>
        <DatabaseWorkerProvider>
          <App />
        </DatabaseWorkerProvider>
      </PanelProvider>
      <Toaster richColors />
    </ThemeProvider>
  </StrictMode>
);
