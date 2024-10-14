export {};

declare global {
  interface Window {
    loadDatabaseBytes: (bytes: Uint8Array) => Promise<void>;
  }
}
