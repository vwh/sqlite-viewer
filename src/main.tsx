import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/themeProvider.tsx";
import App from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <App />
      <Toaster richColors />
    </ThemeProvider>
  </StrictMode>
);
