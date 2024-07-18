import useSQLiteStore from "./store/useSQLiteStore";

import { DBTable } from "./components/table";
import { UploadFile } from "./components/dropzone";
import Loading from "./components/loading";
import Logo from "./components/logo";

function App() {
  const { db, tables, isLoading } = useSQLiteStore();

  return (
    <div className="flex flex-col gap-3">
      {!db && <Logo />}
      <UploadFile />
      <Loading />
      {!isLoading &&
        db &&
        (tables.length > 0 ? (
          <DBTable />
        ) : (
          <p className="text-center font-semibold md:text-2xl p-20 border rounded mb-2">
            Your database is empty, no tables found
          </p>
        ))}
    </div>
  );
}

export default App;
