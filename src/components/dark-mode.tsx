import { useEffect, useState } from "react";

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
    <button onClick={toggleDarkMode} className="relative">
      {darkMode ? (
        <img
          src="./Sun.webp"
          title="Light Mode"
          draggable="false"
          className="transition-transform transform scale-75 dark:scale-100 duration-500 ease-in-out bg-white display-inline-block rounded-full h-6 w-6 p-1 shadow-sm"
          alt="Sun Icon"
          width={24}
          height={24}
        />
      ) : (
        <img
          src="./Moon.webp"
          title="Dark Mode"
          draggable="false"
          className="transition-transform transform scale-75 dark:scale-100 duration-500 ease-in-out"
          alt="Moon Icon"
          width={24}
          height={24}
        />
      )}
    </button>
  );
}

export default DarkModeToggle;
