import { useEffect, useState, useCallback } from "react";

import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";

const DARK_MODE_KEY = "darkMode";
const ANIMATION_CLASS = "animate-circular-reveal";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const applyDarkMode = useCallback((isDarkMode: boolean) => {
    setDarkMode(isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());

    document.body.classList.add(ANIMATION_CLASS);
    setTimeout(() => {
      document.body.classList.remove(ANIMATION_CLASS);
    }, 500);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem(DARK_MODE_KEY);
    const isDarkMode =
      savedMode !== null
        ? savedMode === "true"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;

    applyDarkMode(isDarkMode);

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      applyDarkMode(event.matches);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [applyDarkMode]);

  const toggleTheme = useCallback(() => {
    applyDarkMode(!darkMode);
  }, [darkMode, applyDarkMode]);

  return (
    <Button
      title={darkMode ? "Enable light mode" : "Enable dark mode"}
      onClick={toggleTheme}
      className="relative grow"
    >
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
