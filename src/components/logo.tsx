import useTheme from "@/hooks/useTheme";

export default function Logo() {
  const isDark = useTheme();
  const logoSrc = isDark ? "/sqlite-dark.webp" : "/sqlite-light.webp";

  return (
    <section className="flex justify-center border rounded py-3">
      <div className="flex flex-col items-center gap-3">
        <img
          id="logo"
          title="SQLite Logo"
          src={logoSrc}
          alt="SQLite Logo"
          width="170"
          height="80"
          draggable="false"
        />
        <p className="text-sm">View SQLite files in the browser</p>
      </div>
    </section>
  );
}
