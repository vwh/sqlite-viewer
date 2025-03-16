import { useState, useEffect } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    let timeoutId: number | null = null;

    const listener = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setMatches(media.matches);
      }, 100);
    };

    media.addEventListener("change", listener);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
