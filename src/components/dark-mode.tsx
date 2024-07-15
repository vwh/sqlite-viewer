import { useEffect, useState } from "react";

import { Button } from "./ui/button";

import { Moon, Sun } from "lucide-react";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const updateDarkModeBasedOnSystemTheme = () => {
      const systemDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(systemDarkMode);
      document.body.classList.toggle("dark", systemDarkMode);
    };

    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      const isDarkMode = savedMode === "true";
      setDarkMode(isDarkMode);
      document.body.classList.toggle("dark", isDarkMode);
    } else {
      updateDarkModeBasedOnSystemTheme();
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateDarkModeBasedOnSystemTheme);

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateDarkModeBasedOnSystemTheme
      );
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.body.classList.toggle("dark", newMode);
  };

  return (
    <Button onClick={toggleDarkMode} className="relative" variant="outline">
      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export default DarkModeToggle;
