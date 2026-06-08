type Listing = {
  sourceUrl: string;
  sourcePortal: "immobilienscout24";
  externalId: string;
  title: string;
  address: {
    street: string;
    zip: string;
    city: string;
  };
  propertyType: "office" | "retail" | "residential" | "logistics" | "other";
  livingSpace: number;
  constructionYear?: number;
  rooms?: number;
  askingPrice: number;
  annualRent: null;
  features: string[];
  description?: string;
  images: string[];
  extractedAt: string;
};

const OVERLAY_ID = "proplytic-bulk-import-overlay";
const EXTRACT_CURRENT_PAGE = "EXTRACT_CURRENT_PAGE";
const ADD_LISTINGS = "ADD_LISTINGS";
const PORTAL = "immobilienscout24";
const DEFAULT_PAGE_URL = "https://www.immobilienscout24.de";

// Keep this file standalone. MV3 content scripts are loaded as classic scripts,
// so top-level imports can prevent Chrome from executing the collector at all.
const CARD_SELECTORS = [
  "[data-testid='result-list-entry']",
  "[data-testid*='result-list-entry']",
  "article[data-obid]",
  "article[data-id]",
  ".result-list-entry",
  "li[class*='result-list-entry']"
];

const TITLE_SELECTORS = [
  "[data-testid='result-list-entry-title']",
  "[data-testid='expose-title']",
  "h1",
  "h2",
  "h3",
  "a[href*='/expose/']"
];

const ADDRESS_SELECTORS = [
  "[data-testid*='address']",
  "[class*='address']",
  "[data-qa*='address']"
];

const PRICE_SELECTORS = [
  "[data-testid*='price']",
  "[class*='price']",
  "[data-qa*='price']"
];

const SPACE_SELECTORS = [
  "[data-testid*='living-space']",
  "[data-testid*='area']",
  "[class*='living']",
  "[class*='area']"
];

const ROOMS_SELECTORS = ["[data-testid*='rooms']", "[class*='rooms']"];
const YEAR_SELECTORS = [
  "[data-testid*='construction-year']",
  "[data-testid*='year']",
  "[class*='year']"
];
const DESCRIPTION_SELECTORS = [
  "[data-testid*='description']",
  "[class*='description']",
  "meta[name='description']"
];
const FEATURE_HINTS = [
  "Aufzug",
  "Balkon",
  "Keller",
  "Tiefgarage",
  "Klimaanlage",
  "Glasfaser",
  "Garten",
  "Stellplatz",
  "Dachterrasse",
  "Einbauküche"
];

function extractCurrentPage(): Listing[] {
  if (!window.location.hostname.endsWith("immobilienscout24.de")) {
    return [];
  }

  const listings = extractListPage(document, window.location.href);
  if (listings.length > 0) {
    return listings;
  }

  const detail = mapElementToListing(
    document.body || document.documentElement,
    window.location.href
  );
  return detail ? [detail] : [];
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== EXTRACT_CURRENT_PAGE) {
    return false;
  }

  sendResponse({ listings: extractCurrentPage() });
  return false;
});

injectOverlay();

function extractListPage(document: Document, pageUrl: string): Listing[] {
  const cards = findListingCards(document);
  const seen = new Set<string>();
  const listings: Listing[] = [];

  for (const card of cards) {
    const listing = mapElementToListing(card, pageUrl);
    if (!listing || seen.has(listing.externalId)) {
      continue;
    }
    seen.add(listing.externalId);
    listings.push(listing);
  }

  return listings;
}

function findListingCards(document: Document): Element[] {
  const candidates = new Set<Element>();
  for (const selector of CARD_SELECTORS) {
    document.querySelectorAll(selector).forEach((element) => {
      if (findExposeAnchor(element)) {
        candidates.add(element);
      }
    });
  }

  document.querySelectorAll("article, li, section").forEach((element) => {
    if (findExposeAnchor(element)) {
      candidates.add(element);
    }
  });

  return [...candidates];
}

function mapElementToListing(root: Element, pageUrl: string): Listing | null {
  const sourceUrl = findSourceUrl(root, pageUrl);
  const externalId = extractExternalId(sourceUrl) || getAttributeId(root);
  const title = firstText(root, TITLE_SELECTORS) || "Unbenanntes Inserat";
  const text = normalize(root.textContent || "");
  const askingPrice = parsePrice(firstText(root, PRICE_SELECTORS) || text);
  const livingSpace =
    parseArea(
      firstText(root, SPACE_SELECTORS) ||
        getDefinitionValue(root, /wohnfläche|nutzfläche|fläche/i) ||
        text
    ) ?? 0;

  if (!sourceUrl || !externalId || askingPrice === undefined) {
    return null;
  }

  const addressText =
    firstText(root, ADDRESS_SELECTORS) || getDefinitionValue(root, /adresse|anschrift/i);
  const description = firstText(root, DESCRIPTION_SELECTORS);

  return {
    sourceUrl,
    sourcePortal: PORTAL,
    externalId,
    title,
    address: parseAddress(addressText),
    propertyType: classifyPropertyType(`${title} ${text}`),
    livingSpace,
    constructionYear: parseYear(
      firstText(root, YEAR_SELECTORS) ||
        getDefinitionValue(root, /baujahr|bj\./i) ||
        text
    ),
    rooms: parseRooms(
      firstText(root, ROOMS_SELECTORS) || getDefinitionValue(root, /zimmer|räume/i) || text
    ),
    askingPrice,
    annualRent: null,
    features: extractFeatures(text),
    description,
    images: extractImages(root, pageUrl),
    extractedAt: new Date().toISOString()
  };
}

function findSourceUrl(root: Element, pageUrl: string): string {
  const href = findExposeAnchor(root)?.getAttribute("href");
  if (href) {
    return toAbsoluteUrl(href, pageUrl);
  }
  if (/\/expose\/\d+/i.test(pageUrl)) {
    return pageUrl;
  }
  return "";
}

function findExposeAnchor(root: Element): HTMLAnchorElement | null {
  return root.querySelector("a[href*='/expose/']");
}

function extractExternalId(sourceUrl: string): string {
  const match = sourceUrl.match(/\/expose\/(\d+)/i);
  return match?.[1] ?? "";
}

function getAttributeId(root: Element): string {
  return (
    root.getAttribute("data-obid") ||
    root.getAttribute("data-id") ||
    root.getAttribute("data-expose-id") ||
    ""
  );
}

function firstText(root: Element, selectors: string[]): string {
  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (!element) {
      continue;
    }
    if (element instanceof HTMLMetaElement) {
      return normalize(element.content);
    }
    const text = normalize(element.textContent || "");
    if (text) {
      return text;
    }
  }
  return "";
}

function getDefinitionValue(root: Element, labelPattern: RegExp): string {
  const definitions = [...root.querySelectorAll("dt")];
  for (const definition of definitions) {
    if (labelPattern.test(normalize(definition.textContent || ""))) {
      const value = definition.nextElementSibling;
      if (value) {
        return normalize(value.textContent || "");
      }
    }
  }
  return "";
}

function parseAddress(value?: string) {
  const text = normalize(value || "");
  const commaMatch = text.match(/^(.+?),\s*(\d{5})\s+(.+)$/);
  if (commaMatch) {
    return {
      street: commaMatch[1].trim(),
      zip: commaMatch[2],
      city: commaMatch[3].trim()
    };
  }

  const zipMatch = text.match(/^(.*?)(\d{5})\s+(.+)$/);
  if (zipMatch) {
    return {
      street: normalize(zipMatch[1]).replace(/,\s*$/, "") || "Unbekannt",
      zip: zipMatch[2],
      city: zipMatch[3].trim()
    };
  }

  return {
    street: text || "Unbekannt",
    zip: "00000",
    city: "Unbekannt"
  };
}

function parsePrice(value: string): number | undefined {
  const match = value.match(/(\d{1,3}(?:[.\s]\d{3})*(?:,\d+)?|\d+(?:,\d+)?)\s*(?:€|EUR)/i);
  return match ? parseGermanNumber(match[1]) : undefined;
}

function parseArea(value: string): number | undefined {
  const match = value.match(/(\d+(?:[.,]\d+)?)\s*m(?:²|2)?/i);
  return match ? parseGermanNumber(match[1]) : undefined;
}

function parseRooms(value: string): number | undefined {
  const withLabel = value.match(/(\d+(?:[.,]\d+)?)\s*(?:zimmer|zi\.|räume)/i);
  if (withLabel) {
    return parseGermanNumber(withLabel[1]);
  }
  const plainNumber = value.match(/^\d+(?:[.,]\d+)?$/);
  return plainNumber ? parseGermanNumber(plainNumber[0]) : undefined;
}

function parseYear(value: string): number | undefined {
  const match = value.match(/(?:bj\.?|baujahr)?\s*(18\d{2}|19\d{2}|20\d{2})/i);
  return match ? Number(match[1]) : undefined;
}

function parseGermanNumber(value: string): number {
  const cleaned = value.trim().replace(/\s/g, "");
  const normalized = cleaned.includes(",")
    ? cleaned.replace(/\./g, "").replace(",", ".")
    : cleaned.replace(/\./g, "");
  return Number(normalized);
}

function classifyPropertyType(
  value: string
): "office" | "retail" | "residential" | "logistics" | "other" {
  const text = value.toLowerCase();
  if (/\bbüro|\boffice|gewerbe/.test(text)) {
    return "office";
  }
  if (/einzelhandel|laden|retail|geschäft/.test(text)) {
    return "retail";
  }
  if (/logistik|halle|lager/.test(text)) {
    return "logistics";
  }
  if (/wohnung|haus|mehrfamilien|einfamilien|zimmer|loft/.test(text)) {
    return "residential";
  }
  return "other";
}

function extractFeatures(text: string): string[] {
  return FEATURE_HINTS.filter((feature) =>
    text.toLowerCase().includes(feature.toLowerCase())
  );
}

function extractImages(root: Element, pageUrl: string): string[] {
  return [...root.querySelectorAll("img")]
    .map((image) => image.getAttribute("src"))
    .filter((src): src is string => Boolean(src))
    .map((src) => toAbsoluteUrl(src, pageUrl))
    .filter((src) => /^https?:\/\//i.test(src));
}

function toAbsoluteUrl(href: string, pageUrl: string): string {
  return new URL(href, pageUrl || DEFAULT_PAGE_URL).href;
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

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

  button?.addEventListener("click", () => {
    const listings = extractCurrentPage();
    if (!button) {
      return;
    }
    button.textContent = listings.length
      ? "Wird gesammelt..."
      : "Keine Inserate gefunden";

    if (listings.length > 0) {
      chrome.runtime.sendMessage({
        type: ADD_LISTINGS,
        listings
      });
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
