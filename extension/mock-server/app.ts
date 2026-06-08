import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import type {
  ApiPage,
  CreateImportRequest,
  ImportJob,
  Listing,
  ReviewStatus,
  ValuationResultItem
} from "../src/shared/types";

interface StoredJob {
  job: ImportJob;
  listings: Listing[];
  results: ValuationResultItem[];
}

const VALID_TOKEN = "mock-valid-token";
const VALID_REVIEW_STATUSES: ReviewStatus[] = [
  "pending",
  "reviewed",
  "shortlisted",
  "dismissed"
];

export function createMockApiApp() {
  const app = express();
  const jobs = new Map<string, StoredJob>();

  app.use(cors());
  app.use(express.json({ limit: "4mb" }));
  app.use("/v1", authenticate);

  app.get("/v1/me", (_request, response) => {
    response.json({
      userId: "usr_demo",
      name: "Demo Nutzer",
      email: "demo@proplytic.ai",
      plan: "pro",
      scopes: ["imports:write", "imports:read"]
    });
  });

  app.get("/v1/imports", (request, response) => {
    const page = positiveInt(request.query.page, 1);
    const pageSize = positiveInt(request.query.pageSize, 20, 200);
    const status = request.query.status ? String(request.query.status) : undefined;
    const filtered = [...jobs.values()]
      .map(({ job }) => job)
      .filter((job) => !status || job.status === status);
    response.json(pageItems(filtered, page, pageSize));
  });

  app.post("/v1/imports", (request, response) => {
    const payload = request.body as CreateImportRequest;
    const listings = payload?.listings;

    if (!Array.isArray(listings) || listings.length === 0) {
      return sendError(response, 400, "invalid_listing_data", "listings muss ein nicht-leeres Array sein");
    }
    if (listings.length > 200) {
      return sendError(response, 400, "batch_limit_exceeded", "Maximal 200 Listings pro Request erlaubt");
    }

    const now = new Date().toISOString();
    const id = `imp_${Math.random().toString(36).slice(2, 10)}`;
    const job: ImportJob = {
      id,
      label: payload.label,
      status: "queued",
      createdAt: now,
      updatedAt: now,
      totalItems: listings.length,
      processedItems: 0,
      failedItems: 0
    };
    jobs.set(id, {
      job,
      listings,
      results: listings.map(createResult)
    });

    response.status(202).json(job);
  });

  app.get("/v1/imports/:importId", (request, response) => {
    const stored = jobs.get(request.params.importId);
    if (!stored) {
      return sendError(response, 404, "import_not_found", "Import wurde nicht gefunden");
    }
    completeJob(stored);
    response.json(stored.job);
  });

  app.get("/v1/imports/:importId/results", (request, response) => {
    const stored = jobs.get(request.params.importId);
    if (!stored) {
      return sendError(response, 404, "import_not_found", "Import wurde nicht gefunden");
    }
    completeJob(stored);

    const minScore = request.query.minScore
      ? Number(request.query.minScore)
      : undefined;
    const reviewStatus = request.query.reviewStatus
      ? String(request.query.reviewStatus)
      : undefined;
    const sort = request.query.sort ? String(request.query.sort) : "score_desc";
    const page = positiveInt(request.query.page, 1);
    const pageSize = positiveInt(request.query.pageSize, 50, 200);

    let items = [...stored.results];
    if (minScore !== undefined && Number.isFinite(minScore)) {
      items = items.filter((item) => item.score >= minScore);
    }
    if (reviewStatus) {
      items = items.filter((item) => item.reviewStatus === reviewStatus);
    }
    items.sort(sortResults(sort));

    response.json(pageItems(items, page, pageSize));
  });

  app.patch("/v1/imports/:importId/results/:listingId", (request, response) => {
    const stored = jobs.get(request.params.importId);
    if (!stored) {
      return sendError(response, 404, "import_not_found", "Import wurde nicht gefunden");
    }
    const reviewStatus = request.body?.reviewStatus as ReviewStatus | undefined;
    if (!reviewStatus || !VALID_REVIEW_STATUSES.includes(reviewStatus)) {
      return sendError(response, 400, "invalid_review_status", "reviewStatus ist ungültig");
    }

    const item = stored.results.find(
      (result) => result.listingId === request.params.listingId
    );
    if (!item) {
      return sendError(response, 404, "result_not_found", "Listing-Ergebnis wurde nicht gefunden");
    }
    item.reviewStatus = reviewStatus;
    response.json(item);
  });

  app.delete("/v1/imports/:importId", (request, response) => {
    jobs.delete(request.params.importId);
    response.status(204).send();
  });

  return app;
}

function authenticate(request: Request, response: Response, next: NextFunction) {
  const header = request.header("Authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "");
  if (token !== VALID_TOKEN) {
    return sendError(response, 401, "unauthorized", "Token fehlt oder ist ungültig");
  }
  next();
}

function completeJob(stored: StoredJob) {
  if (stored.job.status === "completed") {
    return;
  }
  stored.job.status = "completed";
  stored.job.processedItems = stored.job.totalItems;
  stored.job.failedItems = 0;
  stored.job.updatedAt = new Date().toISOString();
}

function createResult(listing: Listing): ValuationResultItem {
  const procedure = listing.propertyType === "residential" ? "sachwert" : "ertragswert";
  const liftFactor = listing.propertyType === "office" ? 1.06 : 1.04;
  const ergebnis = roundToThousand(listing.askingPrice * liftFactor);
  const ergebnisProQm = Math.round(ergebnis / Math.max(1, listing.livingSpace));
  const delta = ergebnis - listing.askingPrice;
  const percent = Number(((delta / listing.askingPrice) * 100).toFixed(1));
  const score = Math.max(55, Math.min(96, Math.round(74 + Math.abs(percent) * 2)));

  return {
    listingId: listing.externalId,
    sourceUrl: listing.sourceUrl,
    status: "completed",
    valuation: {
      verfahren: procedure,
      ergebnis,
      ergebnisProQm,
      konfidenzband: {
        min: roundToThousand(ergebnis * 0.92),
        max: roundToThousand(ergebnis * 1.08)
      }
    },
    monteCarlo: {
      szenarienAnzahl: 2000,
      medianErgebnis: roundToThousand(ergebnis * 0.995),
      perzentile: {
        p10: roundToThousand(ergebnis * 0.92),
        p50: roundToThousand(ergebnis * 0.995),
        p90: roundToThousand(ergebnis * 1.08)
      }
    },
    vsAskingPrice: {
      absolut: delta,
      prozent: percent,
      richtung: delta > 0 ? "unter_marktwert" : delta < 0 ? "ueber_marktwert" : "marktgerecht"
    },
    score,
    scoreReason:
      delta > 0
        ? `Angebotspreis ${percent.toLocaleString("de-DE")} % unter berechnetem Marktwert.`
        : "Angebotspreis liegt nah am berechneten Marktwert.",
    reviewStatus: "pending"
  };
}

function sendError(
  response: Response,
  status: number,
  code: string,
  message: string
) {
  return response.status(status).json({
    error: {
      code,
      message
    }
  });
}

function positiveInt(value: unknown, fallback: number, max = 1000): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(Math.floor(parsed), max);
}

function pageItems<T>(items: T[], page: number, pageSize: number): ApiPage<T> {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total: items.length
  };
}

function sortResults(sort: string) {
  return (a: ValuationResultItem, b: ValuationResultItem) => {
    if (sort === "score_asc") {
      return a.score - b.score;
    }
    if (sort === "vsAskingPrice_desc") {
      return b.vsAskingPrice.prozent - a.vsAskingPrice.prozent;
    }
    return b.score - a.score;
  };
}

function roundToThousand(value: number): number {
  return Math.round(value / 1000) * 1000;
}
