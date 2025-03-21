import SchemaTree from "./SchemaTree";

const DatabaseStructureTab = () => {
  return (
    <div className="flex h-full flex-col">
      {/* <div className="flex items-center gap-1 p-2">
        <Button size="sm" variant="outline" className="text-xs">
          Create Table
        </Button>
        <Button size="sm" variant="outline" className="text-xs">
          Create Index
        </Button>
        <Button size="sm" variant="outline" className="text-xs">
          Print Schema
        </Button>
      </div> */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <SchemaTree />
        </div>
      </div>
    </div>
  );
};

export default DatabaseStructureTab;
