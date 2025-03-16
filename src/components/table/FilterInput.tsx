import { memo, useCallback } from "react";

import { Input } from "../ui/input";

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
      className="rounded px-2 py-1 max-h-6 w-full text-[0.8rem]! border-primary/20"
      value={value}
      onChange={handleChange}
      placeholder="Filter"
    />
  );
});

export default FilterInput;
