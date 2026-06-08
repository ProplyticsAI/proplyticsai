import { DEFAULT_SETTINGS } from "./config";
import type {
  ExtensionState,
  Listing,
  StoredImportRun,
  StoredSettings
} from "./types";

const STORAGE_KEYS = {
  settings: "settings",
  queue: "queue",
  imports: "imports"
} as const;

export async function getExtensionState(): Promise<ExtensionState> {
  const values = await chrome.storage.local.get({
    [STORAGE_KEYS.settings]: DEFAULT_SETTINGS,
    [STORAGE_KEYS.queue]: [],
    [STORAGE_KEYS.imports]: []
  });

  return {
    settings: {
      ...DEFAULT_SETTINGS,
      ...(values[STORAGE_KEYS.settings] as Partial<StoredSettings>)
    },
    queue: (values[STORAGE_KEYS.queue] as Listing[]) ?? [],
    imports: (values[STORAGE_KEYS.imports] as StoredImportRun[]) ?? []
  };
}

export async function saveSettings(
  patch: Partial<StoredSettings>
): Promise<StoredSettings> {
  const state = await getExtensionState();
  const settings = { ...state.settings, ...patch };
  await chrome.storage.local.set({ [STORAGE_KEYS.settings]: settings });
  return settings;
}

export async function addListingsToQueue(
  listings: Listing[]
): Promise<{ added: number; total: number; queue: Listing[] }> {
  const state = await getExtensionState();
  const byUrl = new Map(state.queue.map((listing) => [listing.sourceUrl, listing]));
  let added = 0;

  for (const listing of listings) {
    if (!byUrl.has(listing.sourceUrl)) {
      byUrl.set(listing.sourceUrl, listing);
      added += 1;
    }
  }

  const queue = [...byUrl.values()];
  await chrome.storage.local.set({ [STORAGE_KEYS.queue]: queue });
  return { added, total: queue.length, queue };
}

export async function removeListingFromQueue(sourceUrl: string): Promise<Listing[]> {
  const state = await getExtensionState();
  const queue = state.queue.filter((listing) => listing.sourceUrl !== sourceUrl);
  await chrome.storage.local.set({ [STORAGE_KEYS.queue]: queue });
  return queue;
}

export async function clearQueue(): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.queue]: [] });
}

export async function setImports(imports: StoredImportRun[]): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEYS.imports]: imports });
}

export async function upsertImport(run: StoredImportRun): Promise<StoredImportRun[]> {
  const state = await getExtensionState();
  const withoutCurrent = state.imports.filter((item) => item.id !== run.id);
  const imports = [run, ...withoutCurrent].slice(0, 20);
  await setImports(imports);
  return imports;
}
