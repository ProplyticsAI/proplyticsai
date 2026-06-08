import type {
  ExtensionState,
  Listing,
  MeResponse,
  ReviewStatus,
  StoredImportRun,
  StoredSettings
} from "./types";

export const MESSAGE_TYPES = {
  GET_STATE: "GET_STATE",
  SAVE_SETTINGS: "SAVE_SETTINGS",
  VERIFY_TOKEN: "VERIFY_TOKEN",
  EXTRACT_CURRENT_TAB: "EXTRACT_CURRENT_TAB",
  EXTRACT_CURRENT_PAGE: "EXTRACT_CURRENT_PAGE",
  ADD_LISTINGS: "ADD_LISTINGS",
  REMOVE_LISTING: "REMOVE_LISTING",
  CLEAR_QUEUE: "CLEAR_QUEUE",
  SEND_QUEUE: "SEND_QUEUE",
  UPDATE_RESULT_REVIEW: "UPDATE_RESULT_REVIEW",
  OPEN_PLATFORM: "OPEN_PLATFORM"
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export type RuntimeRequest =
  | { type: typeof MESSAGE_TYPES.GET_STATE }
  | { type: typeof MESSAGE_TYPES.SAVE_SETTINGS; settings: Partial<StoredSettings> }
  | { type: typeof MESSAGE_TYPES.VERIFY_TOKEN; settings?: Partial<StoredSettings> }
  | { type: typeof MESSAGE_TYPES.EXTRACT_CURRENT_TAB }
  | { type: typeof MESSAGE_TYPES.EXTRACT_CURRENT_PAGE }
  | { type: typeof MESSAGE_TYPES.ADD_LISTINGS; listings: Listing[] }
  | { type: typeof MESSAGE_TYPES.REMOVE_LISTING; sourceUrl: string }
  | { type: typeof MESSAGE_TYPES.CLEAR_QUEUE }
  | { type: typeof MESSAGE_TYPES.SEND_QUEUE }
  | {
      type: typeof MESSAGE_TYPES.UPDATE_RESULT_REVIEW;
      importId: string;
      listingId: string;
      reviewStatus: ReviewStatus;
    }
  | { type: typeof MESSAGE_TYPES.OPEN_PLATFORM; importId?: string };

export interface ExtractPageResponse {
  listings: Listing[];
}

export interface QueueMutationResponse {
  added: number;
  total: number;
  queue: Listing[];
}

export interface SendQueueResponse {
  imports: StoredImportRun[];
  state: ExtensionState;
}

export interface VerifyTokenResponse {
  user: MeResponse;
  settings: StoredSettings;
}

export interface BackgroundResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}
