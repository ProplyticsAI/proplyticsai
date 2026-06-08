import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createMockApiApp } from "../../mock-server/app";
import { ProplyticApiClient } from "../../src/shared/apiClient";
import type { Listing } from "../../src/shared/types";

const sampleListing: Listing = {
  sourceUrl: "https://www.immobilienscout24.de/expose/111111",
  sourcePortal: "immobilienscout24",
  externalId: "111111",
  title: "Modernes Büro in zentraler Lage",
  address: {
    street: "Friedrichstraße 120",
    zip: "10117",
    city: "Berlin"
  },
  propertyType: "office",
  livingSpace: 188,
  constructionYear: 2012,
  condition: "neuwertig",
  floor: "3. OG",
  rooms: 8,
  askingPrice: 2050000,
  annualRent: null,
  features: ["Aufzug", "Tiefgarage", "Klimaanlage", "Glasfaser"],
  description: "Freitext-Beschreibung aus dem Exposé.",
  images: [],
  extractedAt: "2026-06-08T10:15:00.000Z"
};

describe("ProplyticApiClient against mock bulk-import API", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createMockApiApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (address && typeof address === "object") {
          baseUrl = `http://127.0.0.1:${address.port}/v1`;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("verifies a valid PAT and rejects an invalid PAT", async () => {
    const valid = new ProplyticApiClient({
      baseUrl,
      token: "mock-valid-token"
    });
    const invalid = new ProplyticApiClient({
      baseUrl,
      token: "wrong-token"
    });

    await expect(valid.getMe()).resolves.toMatchObject({
      userId: "usr_demo",
      name: "Demo Nutzer",
      scopes: ["imports:write", "imports:read"]
    });
    await expect(invalid.getMe()).rejects.toThrow("401");
  });

  it("creates an import job, polls it, filters scored results, and updates review status", async () => {
    const client = new ProplyticApiClient({
      baseUrl,
      token: "mock-valid-token"
    });

    const job = await client.createImport({
      label: "ImmoScout Berlin Büro",
      listings: [sampleListing]
    });
    const status = await client.getImport(job.id);
    const results = await client.getResults(job.id, {
      minScore: 70,
      sort: "score_desc"
    });
    const patched = await client.updateResultReview(
      job.id,
      sampleListing.externalId,
      "shortlisted"
    );

    expect(job).toMatchObject({
      status: "queued",
      totalItems: 1,
      processedItems: 0,
      failedItems: 0
    });
    expect(status).toMatchObject({
      id: job.id,
      status: "completed",
      totalItems: 1,
      processedItems: 1,
      failedItems: 0
    });
    expect(results.items).toHaveLength(1);
    expect(results.items[0]).toMatchObject({
      listingId: sampleListing.externalId,
      sourceUrl: sampleListing.sourceUrl,
      status: "completed",
      valuation: {
        verfahren: "ertragswert",
        ergebnis: expect.any(Number),
        ergebnisProQm: expect.any(Number)
      },
      vsAskingPrice: {
        absolut: expect.any(Number),
        prozent: expect.any(Number),
        richtung: expect.any(String)
      },
      score: expect.any(Number),
      scoreReason: expect.any(String),
      reviewStatus: "pending"
    });
    expect(patched.reviewStatus).toBe("shortlisted");
  });

  it("rejects import batches above the 200 listing limit", async () => {
    const client = new ProplyticApiClient({
      baseUrl,
      token: "mock-valid-token"
    });
    const listings = Array.from({ length: 201 }, (_, index) => ({
      ...sampleListing,
      externalId: String(index),
      sourceUrl: `https://www.immobilienscout24.de/expose/${index}`
    }));

    await expect(
      client.createImport({ label: "Zu gross", listings })
    ).rejects.toThrow("400");
  });
});
