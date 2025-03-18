import { useCallback, useEffect, useMemo, useState } from "react";
import { useDatabaseWorker } from "@/providers/DatabaseWorkerProvider";
import { usePanelManager } from "@/providers/PanelProvider";
import { useDatabaseStore } from "@/store/useDatabaseStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Span } from "@/components/ui/span";
import ColumnIcon from "@/components/table/ColumnIcon";

import {
  ChevronLeftIcon,
  PlusIcon,
  SquarePenIcon,
  Trash2Icon
} from "lucide-react";
const EditSection = () => {
  const { handleEditSubmit } = useDatabaseWorker();
  const { selectedRowObject, isInserting, goBackToData } = usePanelManager();
  const { tablesSchema, currentTable, columns } = useDatabaseStore();

  const [editValues, setEditValues] = useState<string[]>([]);

  // Update formValues when isInserting or selectedRow changes
  useEffect(() => {
    if (isInserting) {
      // When inserting, initialize with empty strings or default values
      setEditValues(columns?.map(() => "") || []);
    } else if (selectedRowObject) {
      // When editing, set values from the selected row
      setEditValues(
        selectedRowObject.data.map((value) => value?.toString() ?? "")
      );
    }
  }, [isInserting, selectedRowObject, columns]);

  // Handle when user updates the edit inputs
  const handleEditInputChange = useCallback(
    (index: number, newValue: string) => {
      setEditValues((prev) => {
        const newEditValues = [...prev];
        newEditValues[index] = newValue;
        return newEditValues;
      });
    },
    []
  );

  const editSection = useMemo(
    () => (
      <section className="h-full overflow-auto">
        <div className="flex h-full w-full flex-col">
          <div className="overflow-auto">
            <div className="bg-primary/5 flex w-full items-center justify-between gap-1 border-b p-2 text-sm">
              <div className="flex items-center gap-1">
                {isInserting ? (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    <Span className="whitespace-nowrap">Inserting row</Span>
                  </>
                ) : (
                  <>
                    <SquarePenIcon className="h-4 w-4" />
                    <Span className="whitespace-nowrap">Updating row</Span>
                  </>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs md:hidden"
                onClick={goBackToData}
                aria-label="Go back to data"
              >
                <ChevronLeftIcon className="mr-1 h-3 w-3" />
                Go back
              </Button>
            </div>

            {columns?.map((column, index) => (
              <div key={column}>
                <label
                  htmlFor={column}
                  className="bg-primary/5 flex items-center gap-1 rounded-sm p-2"
                >
                  <ColumnIcon
                    columnSchema={tablesSchema[currentTable!]?.schema[index]}
                  />
                  <Span className="text-xs font-medium capitalize">
                    {column}
                  </Span>
                </label>
                <Input
                  id={column}
                  name={column}
                  className="border-primary/20 h-8 rounded-none text-sm text-[0.8rem]!"
                  value={editValues[index] || ""}
                  onChange={(e) => handleEditInputChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex w-full">
            <Button
              size="sm"
              variant="outline"
              className="w-full text-xs"
              onClick={() =>
                handleEditSubmit(isInserting ? "insert" : "update", editValues)
              }
              aria-label={isInserting ? "Insert row" : "Apply changes"}
            >
              {isInserting ? (
                <>
                  <PlusIcon className="mr-1 h-3 w-3" />
                  Insert row
                </>
              ) : (
                <>
                  <SquarePenIcon className="mr-1 h-3 w-3" />
                  Apply changes
                </>
              )}
            </Button>
            {!isInserting && (
              <Button
                size="sm"
                variant="destructive"
                className="rounded-none text-xs"
                onClick={() => handleEditSubmit("delete", editValues)}
                aria-label="Delete row"
              >
                <Trash2Icon className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </section>
    ),
    [
      currentTable,
      tablesSchema,
      columns,
      editValues,
      handleEditInputChange,
      handleEditSubmit,
      isInserting,
      goBackToData
    ]
  );

  return editSection;
};

export default EditSection;
