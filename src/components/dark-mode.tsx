import { useEffect, useState } from "react";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.body.classList.toggle("dark", savedMode);
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
          className="transition-transform transform scale-75 dark:scale-100 duration-500 ease-in-out bg-white display-inline-block rounded-full h-6 w-6 p-1 shadow-sm"
          alt="Sun Icon"
          width={24}
          height={24}
        />
      ) : (
        <img
          src="./Moon.webp"
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
