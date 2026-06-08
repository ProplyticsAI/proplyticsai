import { ProplyticApiClient } from "../shared/apiClient";
import {
  MAX_IMPORT_BATCH_SIZE,
  POLL_INTERVAL_MS,
  POLL_MAX_ATTEMPTS,
  POLL_MAX_INTERVAL_MS
} from "../shared/config";
import {
  MESSAGE_TYPES,
  type BackgroundResponse,
  type ExtractPageResponse,
  type RuntimeRequest,
  type SendQueueResponse,
  type VerifyTokenResponse
} from "../shared/messages";
import {
  addListingsToQueue,
  clearQueue,
  getExtensionState,
  removeListingFromQueue,
  saveSettings,
  upsertImport
} from "../shared/storage";
import type {
  ImportJob,
  Listing,
  ReviewStatus,
  StoredImportRun,
  StoredSettings
} from "../shared/types";

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: false });
});

chrome.runtime.onMessage.addListener(
  (message: RuntimeRequest, sender, sendResponse) => {
    handleMessage(message, sender)
      .then((data) => sendResponse({ ok: true, data } satisfies BackgroundResponse))
      .catch((error: Error) =>
        sendResponse({
          ok: false,
          error: error.message
        } satisfies BackgroundResponse)
      );
    return true;
  }
);

async function handleMessage(message: RuntimeRequest, sender: chrome.runtime.MessageSender) {
  switch (message.type) {
    case MESSAGE_TYPES.GET_STATE:
      return getExtensionState();

    case MESSAGE_TYPES.SAVE_SETTINGS:
      return saveSettings(message.settings);

    case MESSAGE_TYPES.VERIFY_TOKEN:
      return verifyToken(message.settings);

    case MESSAGE_TYPES.EXTRACT_CURRENT_TAB:
      return extractCurrentTab();

    case MESSAGE_TYPES.ADD_LISTINGS:
      return addListingsToQueue(message.listings);

    case MESSAGE_TYPES.REMOVE_LISTING:
      await removeListingFromQueue(message.sourceUrl);
      return getExtensionState();

    case MESSAGE_TYPES.CLEAR_QUEUE:
      await clearQueue();
      return getExtensionState();

    case MESSAGE_TYPES.SEND_QUEUE:
      return sendQueuedListings();

    case MESSAGE_TYPES.UPDATE_RESULT_REVIEW:
      return updateResultReview(
        message.importId,
        message.listingId,
        message.reviewStatus
      );

    case MESSAGE_TYPES.OPEN_PLATFORM:
      return openPlatform(message.importId);

    case MESSAGE_TYPES.EXTRACT_CURRENT_PAGE:
      throw new Error("Diese Nachricht wird nur im Content-Script verarbeitet.");

    default:
      return sender;
  }
}

async function verifyToken(
  settingsPatch: Partial<StoredSettings> = {}
): Promise<VerifyTokenResponse> {
  const merged = await saveSettings(settingsPatch);
  if (!merged.token.trim()) {
    throw new Error("Bitte zuerst einen Personal-Access-Token eingeben.");
  }

  const client = createClient(merged);
  const user = await client.getMe();
  const settings = await saveSettings({ connectedUser: user });
  return { user, settings };
}

async function extractCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("Aktiver Tab konnte nicht ermittelt werden.");
  }

  const response = await sendTabMessage<ExtractPageResponse>(tab.id, {
    type: MESSAGE_TYPES.EXTRACT_CURRENT_PAGE
  });

  const mutation = await addListingsToQueue(response.listings);
  return {
    ...mutation,
    listings: response.listings
  };
}

async function sendQueuedListings(): Promise<SendQueueResponse> {
  const state = await getExtensionState();
  if (!state.settings.token.trim()) {
    throw new Error("Bitte zuerst den Proplytic-Token in den Einstellungen hinterlegen.");
  }
  if (state.queue.length === 0) {
    throw new Error("Die Sammelliste ist leer.");
  }

  const client = createClient(state.settings);
  const completedRuns: StoredImportRun[] = [];

  for (const batch of chunk(state.queue, MAX_IMPORT_BATCH_SIZE)) {
    const label = `ImmoScout-Import ${new Date().toLocaleString("de-DE")}`;
    const job = await client.createImport({ label, listings: batch });
    let run = toStoredRun(job, []);
    await upsertImport(run);

    const completed = await pollImport(client, job.id, async (nextJob) => {
      run = { ...run, ...toStoredRun(nextJob, run.resultItems) };
      await upsertImport(run);
    });

    const results = await client.getResults(completed.id, {
      sort: "score_desc",
      minScore: 70,
      pageSize: 200
    });
    run = toStoredRun(completed, results.items);
    await upsertImport(run);
    completedRuns.push(run);
  }

  await clearQueue();
  return {
    imports: completedRuns,
    state: await getExtensionState()
  };
}

async function updateResultReview(
  importId: string,
  listingId: string,
  reviewStatus: ReviewStatus
) {
  const state = await getExtensionState();
  const client = createClient(state.settings);
  const updated = await client.updateResultReview(importId, listingId, reviewStatus);

  const run = state.imports.find((item) => item.id === importId);
  if (run) {
    await upsertImport({
      ...run,
      resultItems: run.resultItems.map((item) =>
        item.listingId === listingId ? updated : item
      )
    });
  }

  return updated;
}

async function openPlatform(importId?: string) {
  const state = await getExtensionState();
  const base = state.settings.appBaseUrl.replace(/\/+$/, "");
  await chrome.tabs.create({
    url: importId ? `${base}/${encodeURIComponent(importId)}` : base
  });
  return true;
}

function createClient(settings: StoredSettings) {
  return new ProplyticApiClient({
    baseUrl: settings.apiBaseUrl,
    token: settings.token
  });
}

async function pollImport(
  client: ProplyticApiClient,
  importId: string,
  onProgress: (job: ImportJob) => Promise<void>
): Promise<ImportJob> {
  let waitMs = POLL_INTERVAL_MS;
  for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt += 1) {
    const job = await client.getImport(importId);
    await onProgress(job);
    if (["completed", "partial", "failed"].includes(job.status)) {
      return job;
    }
    await delay(waitMs);
    waitMs = Math.min(POLL_MAX_INTERVAL_MS, Math.round(waitMs * 1.4));
  }
  throw new Error("Import-Polling wurde ohne Abschluss beendet.");
}

function toStoredRun(job: ImportJob, resultItems: StoredImportRun["resultItems"]): StoredImportRun {
  return {
    id: job.id,
    label: job.label,
    status: job.status,
    totalItems: job.totalItems,
    processedItems: job.processedItems,
    failedItems: job.failedItems,
    resultItems,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  };
}

function sendTabMessage<T>(tabId: number, message: RuntimeRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response: T) => {
      const error = chrome.runtime.lastError;
      if (error) {
        reject(new Error(error.message));
      } else {
        resolve(response);
      }
    });
  });
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}
