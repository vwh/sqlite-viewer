export const isDate = (value: string) => {
  return value.includes("DATE") || value === "TIMESTAMP";
};

export const isBlob = (value: string) => {
  return value === "BLOB";
};

export const isText = (value: string) => {
  return (
    value.includes("CHAR") ||
    value.includes("TEXT") ||
    value === "CLOB" ||
    value.includes("VARCHAR")
  );
};

export const isInteger = (value: string) => {
  return value.includes("INT");
};

export const isReal = (value: string) => {
  return (
    value.includes("REAL") ||
    value.includes("FLOAT") ||
    value.includes("DOUBLE") ||
    value.includes("DECIMAL")
  );
};

export const isNumeric = (value: string) => {
  return value.includes("NUMERIC");
};

export const IsNumber = (value: string) => {
  return isInteger(value) || isReal(value) || isNumeric(value);
};

export const isBoolean = (value: string) => {
  return value.includes("BOOL");
};
