import type {
  ApiPage,
  CreateImportRequest,
  ImportJob,
  MeResponse,
  ReviewStatus,
  ValuationResultItem
} from "./types";

export interface ApiClientOptions {
  baseUrl: string;
  token: string;
  fetcher?: typeof fetch;
}

export interface ResultsQuery {
  sort?: "score_desc" | "score_asc" | "vsAskingPrice_desc";
  minScore?: number;
  reviewStatus?: ReviewStatus;
  page?: number;
  pageSize?: number;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly payload: unknown
  ) {
    super(`${status} ${message}`);
    this.name = "ApiError";
  }
}

export class ProplyticApiClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly fetcher: typeof fetch;

  constructor({ baseUrl, token, fetcher = fetch.bind(globalThis) }: ApiClientOptions) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.token = token;
    this.fetcher = fetcher;
  }

  getMe(): Promise<MeResponse> {
    return this.request<MeResponse>("/me");
  }

  createImport(payload: CreateImportRequest): Promise<ImportJob> {
    return this.request<ImportJob>("/imports", {
      method: "POST",
      body: payload
    });
  }

  getImport(importId: string): Promise<ImportJob> {
    return this.request<ImportJob>(`/imports/${encodeURIComponent(importId)}`);
  }

  getResults(
    importId: string,
    query: ResultsQuery = {}
  ): Promise<ApiPage<ValuationResultItem>> {
    return this.request<ApiPage<ValuationResultItem>>(
      `/imports/${encodeURIComponent(importId)}/results`,
      { query: { ...query } }
    );
  }

  updateResultReview(
    importId: string,
    listingId: string,
    reviewStatus: ReviewStatus
  ): Promise<ValuationResultItem> {
    return this.request<ValuationResultItem>(
      `/imports/${encodeURIComponent(importId)}/results/${encodeURIComponent(
        listingId
      )}`,
      {
        method: "PATCH",
        body: { reviewStatus }
      }
    );
  }

  private async request<T>(
    path: string,
    options: {
      method?: string;
      body?: unknown;
      query?: Record<string, string | number | undefined>;
    } = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    for (const [key, value] of Object.entries(options.query ?? {})) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }

    const response = await this.fetcher(url, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });

    if (!response.ok) {
      const payload = await readJsonSafely(response);
      const message =
        getErrorMessage(payload) || response.statusText || "API request failed";
      throw new ApiError(response.status, message, payload);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }
}

async function readJsonSafely(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getErrorMessage(payload: unknown): string | undefined {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    payload.error &&
    typeof payload.error === "object" &&
    "message" in payload.error
  ) {
    return String(payload.error.message);
  }
  return undefined;
}
