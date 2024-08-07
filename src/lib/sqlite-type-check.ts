export const isDate = (value: string): boolean => {
  return value.includes("DATE") || value === "TIMESTAMP";
};

export const isBlob = (value: string): boolean => {
  return value === "BLOB";
};

export const isText = (value: string): boolean => {
  return (
    value.includes("CHAR") ||
    value.includes("TEXT") ||
    value === "CLOB" ||
    value.includes("VARCHAR")
  );
};

export const isInteger = (value: string): boolean => {
  return value.includes("INT");
};

export const isReal = (value: string): boolean => {
  return (
    value.includes("REAL") ||
    value.includes("FLOAT") ||
    value.includes("DOUBLE") ||
    value.includes("DECIMAL")
  );
};

export const isNumeric = (value: string): boolean => {
  return value.includes("NUMERIC");
};

export const IsNumber = (value: string): boolean => {
  return isInteger(value) || isReal(value) || isNumeric(value);
};

export const isBoolean = (value: string): boolean => {
  return value.includes("BOOL");
};
