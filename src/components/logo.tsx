import { useEffect, useRef } from "react";

export default function Logo() {
  const logoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const updateLogoSrc = () => {
      if (document.body.classList.contains("dark")) {
        logo.src = "/sqlite-dark.webp";
      } else {
        logo.src = "/sqlite-light.webp";
      }
    };

    updateLogoSrc();

    // Update logo on class change
    const observer = new MutationObserver(updateLogoSrc);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="flex justify-center border rounded py-3">
      <div className="flex flex-col items-center gap-3">
        <img
          ref={logoRef}
          id="logo"
          title="SQLite Logo"
          src="./sqlite-light.webp"
          alt="SQLite Logo"
          width="160"
          height="80"
          draggable="false"
        />
        <p className="text-sm">View SQLite file online</p>
      </div>
    </section>
  );
}
