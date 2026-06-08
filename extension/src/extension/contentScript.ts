import { getExtractorForLocation } from "../extractors";
import { MESSAGE_TYPES, type RuntimeRequest } from "../shared/messages";
import type { Listing } from "../shared/types";

const OVERLAY_ID = "proplytic-bulk-import-overlay";

function extractCurrentPage(): Listing[] {
  const extractor = getExtractorForLocation(window.location);
  return extractor?.extractCurrentPage(document, window.location.href) ?? [];
}

chrome.runtime.onMessage.addListener(
  (message: RuntimeRequest, _sender, sendResponse) => {
    if (message.type !== MESSAGE_TYPES.EXTRACT_CURRENT_PAGE) {
      return false;
    }

    sendResponse({ listings: extractCurrentPage() });
    return false;
  }
);

injectOverlay();

function injectOverlay() {
  if (document.getElementById(OVERLAY_ID)) {
    return;
  }

  const container = document.createElement("div");
  container.id = OVERLAY_ID;
  container.innerHTML = `
    <style>
      #${OVERLAY_ID} {
        position: fixed;
        right: 20px;
        bottom: 20px;
        z-index: 2147483647;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      #${OVERLAY_ID} button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid #2D5A3D;
        border-radius: 8px;
        background: #2D5A3D;
        color: #FDFBF7;
        box-shadow: 0 4px 12px rgba(0,0,0,0.16);
        cursor: pointer;
        font-size: 13px;
        font-weight: 700;
        min-height: 40px;
        padding: 0 14px;
      }
      #${OVERLAY_ID} button:hover { background: #244a32; }
      #${OVERLAY_ID} .proplytic-count {
        border-radius: 6px;
        background: rgba(255,255,255,0.18);
        min-width: 22px;
        padding: 2px 6px;
        text-align: center;
      }
    </style>
    <button type="button" title="Sichtbare Inserate zur Proplytic-Queue hinzufügen">
      <span>Bulk sammeln</span>
      <span class="proplytic-count">0</span>
    </button>
  `;

  const button = container.querySelector("button");
  const count = container.querySelector(".proplytic-count");

  const updateCount = () => {
    if (count) {
      count.textContent = String(extractCurrentPage().length);
    }
  };

  button?.addEventListener("click", async () => {
    const listings = extractCurrentPage();
    if (!button) {
      return;
    }
    button.textContent = listings.length
      ? "Wird gesammelt..."
      : "Keine Inserate gefunden";

    if (listings.length > 0) {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.ADD_LISTINGS,
        listings
      } satisfies RuntimeRequest);
      button.innerHTML = `<span>${listings.length} gesammelt</span><span class="proplytic-count">${listings.length}</span>`;
      setTimeout(() => {
        button.innerHTML = `<span>Bulk sammeln</span><span class="proplytic-count">${extractCurrentPage().length}</span>`;
      }, 1800);
    }
  });

  document.documentElement.appendChild(container);
  updateCount();
  window.setInterval(updateCount, 3000);
}
