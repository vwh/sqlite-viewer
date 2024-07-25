import { useState, useEffect } from "react";

export default function useTheme() {
  const [isDark, setIsDark] = useState(() =>
    document.body.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains("dark"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
