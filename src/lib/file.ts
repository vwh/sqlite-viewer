const units = ["Bytes", "KB", "MB", "GB", "TB"];

export function formatFileSize(bytes: number): string {
  let unitIndex = 0;

  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024;
    unitIndex++;
  }

  return `${bytes.toFixed(2)} ${units[unitIndex]}`;
}
