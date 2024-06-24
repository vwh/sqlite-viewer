import useSQLiteStore from "../store/useSQLiteStore";

export function UploadFile() {
  const { loadDatabase, setTables, setSelectedTable } = useSQLiteStore();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setTables([]);
      setSelectedTable("0");
      await loadDatabase(file);
    }
  };

  return (
    <section>
      <h1>SQLite File Loader</h1>
      <input type="file" onChange={handleFileChange} />
    </section>
  );
}
