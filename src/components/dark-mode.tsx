import { useEffect, useState, useCallback } from "react";

import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const applyDarkMode = useCallback((isDarkMode: boolean) => {
    setDarkMode(isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, []);

  useEffect(() => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      applyDarkMode(savedMode === "true");
    } else {
      applyDarkMode(systemPrefersDark);
    }

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      applyDarkMode(event.matches);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [applyDarkMode]);

  return (
    <Button
      onClick={() => {
        applyDarkMode(!darkMode);
      }}
      className="relative"
      variant="outline"
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
