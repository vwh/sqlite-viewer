import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";

import { MoonIcon, SunIcon } from "lucide-react";

const THEME_KEY = "theme-mode";
const ANIMATION_CLASS = "animate-circular-reveal";

type Theme = "light" | "dark";

export default function ThemeModeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return savedTheme || (prefersDark ? "dark" : "light");
  });

  const applyTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);

    document.body.classList.remove("light", "dark");
    document.body.classList.add(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);

    document.body.classList.add(ANIMATION_CLASS);
    setTimeout(() => {
      document.body.classList.remove(ANIMATION_CLASS);
    }, 500);
  }, []);

  // Apply the initial
  useEffect(() => {
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(event.matches ? "dark" : "light");
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Apply the initial theme
    applyTheme(theme);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [applyTheme, theme]);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "light" ? "dark" : "light");
  }, [theme, applyTheme]);

  const MemoizedThemeButton = useMemo(
    () => (
      <Button
        className="relative grow"
        onClick={toggleTheme}
        title={theme === "dark" ? "Enable light mode" : "Enable dark mode"}
      >
        {theme === "dark" ? (
          <SunIcon className="h-5 w-5" />
        ) : (
          <MoonIcon className="h-5 w-5" />
        )}
      </Button>
    ),
    [theme]
  );

  return MemoizedThemeButton;
}
