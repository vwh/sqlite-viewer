import { memo, useCallback } from "react";

import { Input } from "@/components/ui/input";

interface FilterInputProps {
  column: string;
  value: string;
  onChange: (column: string, value: string) => void;
}

const FilterInput = memo(({ column, value, onChange }: FilterInputProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(column, e.target.value),
    [column, onChange]
  );

  return (
    <Input
      type="text"
      className="border-primary/20 max-h-6 w-full rounded px-2 py-1 text-[0.8rem]!"
      value={value}
      onChange={handleChange}
      placeholder="Filter"
    />
  );
});

export default FilterInput;
