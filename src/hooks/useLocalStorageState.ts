import { useEffect, useState } from "react";

export const getLocalStorageItem = (key: string, defaultValue: string) =>
  localStorage.getItem(key) || defaultValue;

export const setLocalStorageItem = (key: string, value: string) =>
  localStorage.setItem(key, value);

const useLocalStorageState = (key: string, defaultValue: string) => {
  const [state, setState] = useState(() =>
    getLocalStorageItem(key, defaultValue)
  );

  useEffect(() => {
    setLocalStorageItem(key, state);
  }, [key, state]);

  return [state, setState] as const;
};

export default useLocalStorageState;
