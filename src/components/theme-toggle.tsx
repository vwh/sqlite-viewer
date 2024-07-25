import { useEffect, useState, useCallback } from "react";

import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const applyDarkMode = useCallback((isDarkMode: boolean) => {
    setDarkMode(isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode.toString());

    document.body.classList.add("animate-circular-reveal");
    setTimeout(() => {
      document.body.classList.remove("animate-circular-reveal");
    }, 500);
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
  }, []);

  return (
    <Button
      title={darkMode ? "Enable light mode" : "Enable dark mode"}
      onClick={() => {
        applyDarkMode(!darkMode);
      }}
      className="relative grow"
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
