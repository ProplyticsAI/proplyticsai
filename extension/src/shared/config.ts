import type { StoredSettings } from "./types";

export const DEFAULT_API_BASE_URL = "http://localhost:4317/v1";
export const DEFAULT_APP_BASE_URL = "https://app.proplytic.ai/imports";
export const MAX_IMPORT_BATCH_SIZE = 200;
export const POLL_INTERVAL_MS = 5000;
export const POLL_MAX_INTERVAL_MS = 15000;
export const POLL_MAX_ATTEMPTS = 24;

export const DEFAULT_SETTINGS: StoredSettings = {
  token: "",
  apiBaseUrl: DEFAULT_API_BASE_URL,
  appBaseUrl: DEFAULT_APP_BASE_URL
};
