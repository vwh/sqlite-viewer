import useSQLiteStore from "./store/useSQLiteStore";
import { DBTable } from "./components/table";
import { UploadFile } from "./components/dropzone";
import Loading from "./components/loading";

function App() {
  const { db, tables, isLoading } = useSQLiteStore();

  return (
    <div className="flex flex-col gap-2">
      {!db && (
        <section className="flex justify-center border rounded py-2">
          <div className="flex flex-col items-center gap-2">
            <img
              id="logo"
              title="SQLite Logo"
              src="https://raw.githubusercontent.com/vwh/sqlite-viewer/main/public/logo.webp"
              alt="SQLite Logo"
              className="h-20"
            />
            <p className="text-sm">View SQLite file online</p>
          </div>
        </section>
      )}
      <UploadFile />
      <Loading />
      {!isLoading &&
        db &&
        (tables.length > 0 ? (
          <DBTable />
        ) : (
          <p className="text-center font-semibold md:text-3xl p-20 border rounded mb-2">
            Your database is empty, no tables found
          </p>
        ))}
    </div>
  );
}

export default App;
