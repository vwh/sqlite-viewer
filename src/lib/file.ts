const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export function bytesToValue(bytes: number): string {
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = sizes[i];
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(2)} ${size}`;
}
