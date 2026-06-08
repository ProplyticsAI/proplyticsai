import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  extractImmoScout24DetailListing,
  extractImmoScout24Listings
} from "../../src/extractors/immoscout24";

const testDir = dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) =>
  readFileSync(resolve(testDir, "../fixtures", name), "utf8");

const documentFrom = (html: string, url: string) => {
  const document = new DOMParser().parseFromString(html, "text/html");
  Object.defineProperty(document, "URL", { value: url });
  return document;
};

describe("ImmoScout24 extraction", () => {
  it("maps visible search-result cards into the API Listing schema", () => {
    const document = documentFrom(
      fixture("immoscout-search.html"),
      "https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-kaufen"
    );

    const listings = extractImmoScout24Listings(document, document.URL);

    expect(listings).toHaveLength(2);
    expect(listings[0]).toMatchObject({
      externalId: "111111",
      sourcePortal: "immobilienscout24",
      sourceUrl: "https://www.immobilienscout24.de/expose/111111",
      title: "Helle 3-Zimmer-Wohnung mit Balkon",
      address: {
        street: "Musterstrasse 12",
        zip: "10115",
        city: "Berlin"
      },
      propertyType: "residential",
      livingSpace: 82,
      rooms: 3,
      constructionYear: 1998,
      askingPrice: 450000
    });
    expect(listings[0].features).toContain("Aufzug");
    expect(listings[1]).toMatchObject({
      externalId: "222222",
      title: "Modernes Büro in zentraler Lage",
      propertyType: "office",
      address: {
        street: "Friedrichstraße 120",
        zip: "10117",
        city: "Berlin"
      },
      livingSpace: 188,
      rooms: 8,
      constructionYear: 2012,
      askingPrice: 2050000
    });
  });

  it("extracts one Listing from an expose detail page", () => {
    const document = documentFrom(
      fixture("immoscout-detail.html"),
      "https://www.immobilienscout24.de/expose/333333"
    );

    const listing = extractImmoScout24DetailListing(document, document.URL);

    if (!listing) {
      throw new Error("Expected detail listing to be extracted");
    }

    expect(listing).toMatchObject({
      externalId: "333333",
      sourcePortal: "immobilienscout24",
      sourceUrl: "https://www.immobilienscout24.de/expose/333333",
      title: "Mehrfamilienhaus mit Entwicklungspotenzial",
      address: {
        street: "Hauptstrasse 9",
        zip: "14467",
        city: "Potsdam"
      },
      propertyType: "residential",
      livingSpace: 240,
      rooms: 8,
      constructionYear: 1974,
      askingPrice: 1250000,
      description: "Gepflegtes Haus mit Ausbaureserve, Garten und Stellplätzen."
    });
    expect(listing.images).toEqual(["https://img.example.test/haus.jpg"]);
  });

  it("deduplicates cards that point to the same expose", () => {
    const html = `
      <article data-testid="result-list-entry"><a href="/expose/444444">Loft</a><span>700.000 €</span><span>80 m²</span></article>
      <article data-testid="result-list-entry"><a href="/expose/444444">Loft Duplikat</a><span>700.000 €</span><span>80 m²</span></article>
    `;
    const document = documentFrom(html, "https://www.immobilienscout24.de");

    const listings = extractImmoScout24Listings(document, document.URL);

    expect(listings).toHaveLength(1);
    expect(listings[0].externalId).toBe("444444");
  });
});
