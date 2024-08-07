export default function Logo() {
  return (
    <header className="rounded bg-gradient-to-r shadow-md dark:from-gray-800 dark:to-indigo-900">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">SQLite Viewer</h1>
          <p className="max-w-md text-sm sm:text-base">
            Explore and analyze your SQLite databases directly in your browser
          </p>
        </div>
      </div>
    </header>
  );
}
