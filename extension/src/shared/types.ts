export type SourcePortal = "immobilienscout24";

export type PropertyType =
  | "office"
  | "retail"
  | "residential"
  | "logistics"
  | "other";

export type ListingCondition =
  | "neuwertig"
  | "sehr_gut"
  | "gut"
  | "gepflegt"
  | "renovierungsbeduerftig";

export type ImportJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "partial"
  | "failed";

export type ResultStatus = "completed" | "failed" | "skipped";
export type ReviewStatus = "pending" | "reviewed" | "shortlisted" | "dismissed";
export type ValuationProcedure = "ertragswert" | "sachwert";

export interface ListingAddress {
  street: string;
  zip: string;
  city: string;
}

export interface Listing {
  sourceUrl: string;
  sourcePortal: SourcePortal;
  externalId: string;
  title: string;
  address: ListingAddress;
  propertyType: PropertyType;
  livingSpace: number;
  constructionYear?: number;
  condition?: ListingCondition;
  floor?: string;
  rooms?: number;
  askingPrice: number;
  annualRent?: number | null;
  features?: string[];
  description?: string;
  images?: string[];
  extractedAt: string;
}

export interface ImportJob {
  id: string;
  label?: string;
  status: ImportJobStatus;
  createdAt: string;
  updatedAt: string;
  totalItems: number;
  processedItems: number;
  failedItems: number;
}

export interface ValuationResultItem {
  listingId: string;
  sourceUrl: string;
  status: ResultStatus;
  valuation: {
    verfahren: ValuationProcedure;
    ergebnis: number;
    ergebnisProQm: number;
    konfidenzband: {
      min: number;
      max: number;
    };
  };
  monteCarlo: {
    szenarienAnzahl: number;
    medianErgebnis: number;
    perzentile: {
      p10: number;
      p50: number;
      p90: number;
    };
  };
  vsAskingPrice: {
    absolut: number;
    prozent: number;
    richtung: "unter_marktwert" | "ueber_marktwert" | "marktgerecht";
  };
  score: number;
  scoreReason: string;
  reviewStatus: ReviewStatus;
}

export interface ApiPage<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface MeResponse {
  userId: string;
  name: string;
  email: string;
  plan: string;
  scopes: string[];
}

export interface CreateImportRequest {
  label?: string;
  listings: Listing[];
}

export interface StoredSettings {
  token: string;
  apiBaseUrl: string;
  appBaseUrl: string;
  connectedUser?: MeResponse;
}

export interface StoredImportRun {
  id: string;
  label?: string;
  status: ImportJobStatus;
  totalItems: number;
  processedItems: number;
  failedItems: number;
  resultItems: ValuationResultItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ExtensionState {
  settings: StoredSettings;
  queue: Listing[];
  imports: StoredImportRun[];
}
