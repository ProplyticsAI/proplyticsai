# Proplytic Chrome Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Manifest V3 Chrome extension that extracts ImmoScout24 listings client-side, queues them locally, uploads them to a mock Proplytic bulk-import API, polls status, and displays prioritized review results.

**Architecture:** Keep the extension in `extension/` so it does not disturb the existing Next.js app. Shared TypeScript modules define API/spec types, API client, storage, messaging, and portal extractor contracts; ImmoScout24 extraction is a portal module; the background service worker owns API calls and polling; content scripts own DOM extraction and page overlay; popup/options/sidepanel React surfaces own German UI.

**Tech Stack:** TypeScript, React 18, Vite, Manifest V3, Chrome extension APIs, Express mock server, Vitest, jsdom.

---

### Task 1: Extension Package And Test Harness

**Files:**
- Create: `extension/package.json`
- Create: `extension/tsconfig.json`
- Create: `extension/vite.config.ts`
- Create: `extension/vitest.config.ts`
- Modify: `.gitignore`

- [x] Add isolated npm scripts for `build`, `typecheck`, `test`, `mock-api`, and watch build.
- [x] Configure Vite multi-entry output for popup, sidepanel, options, background worker, and content script.
- [x] Configure Vitest with jsdom.

### Task 2: TDD For Extraction

**Files:**
- Create: `extension/tests/fixtures/immoscout-search.html`
- Create: `extension/tests/fixtures/immoscout-detail.html`
- Create: `extension/tests/extractors/immoscout24.test.ts`
- Create: `extension/src/extractors/immoscout24.ts`
- Create: `extension/src/shared/types.ts`

- [x] Write tests that map list-page cards into the `Listing` schema from `docs/api-spec-bulk-import.md`.
- [x] Write tests that map a detail page into one `Listing`.
- [x] Write dedupe tests for duplicate expose links.
- [x] Implement selector fallbacks and mapper helpers.
- [x] Run `npm test -- tests/extractors/immoscout24.test.ts`.

### Task 3: TDD For API Client And Mock API

**Files:**
- Create: `extension/tests/api/apiClient.test.ts`
- Create: `extension/src/shared/apiClient.ts`
- Create: `extension/mock-server/app.ts`
- Create: `extension/mock-server/server.ts`

- [x] Write tests for `GET /v1/me` token verification.
- [x] Write tests for `POST /v1/imports`, polling `GET /v1/imports/{id}`, filtered/sorted results, and review-status patching.
- [x] Write tests for the 200-listing batch limit.
- [x] Implement the API client with configurable base URL and Bearer auth.
- [x] Implement the Express mock routes exactly under `/v1`.
- [x] Run `npm test -- tests/api/apiClient.test.ts`.

### Task 4: Extension Runtime

**Files:**
- Create: `extension/public/manifest.json`
- Create: `extension/src/extension/background.ts`
- Create: `extension/src/extension/contentScript.ts`
- Create: `extension/src/extractors/index.ts`
- Create: `extension/src/shared/config.ts`
- Create: `extension/src/shared/messages.ts`
- Create: `extension/src/shared/storage.ts`

- [x] Add Manifest V3 permissions, host permissions, content scripts, sidepanel, popup, and options.
- [x] Add background message handlers for queue operations, token verification, batching, polling, result fetching, and result review updates.
- [x] Add a page overlay button that extracts visible listings from the current ImmoScout page.
- [x] Persist PAT, API base URL, app URL, queue, jobs, and results in `chrome.storage.local`.

### Task 5: German UI

**Files:**
- Create: `extension/popup.html`
- Create: `extension/options.html`
- Create: `extension/sidepanel.html`
- Create: `extension/src/popup/main.tsx`
- Create: `extension/src/popup/PopupApp.tsx`
- Create: `extension/src/options/main.tsx`
- Create: `extension/src/options/OptionsApp.tsx`
- Create: `extension/src/ui/extension.css`

- [x] Build a compact beige/dark-green popup and sidepanel queue/result UI.
- [x] Build options UI for token, API base URL, app URL, and connection verification.
- [x] Use German copy throughout.

### Task 6: Docs And Verification

**Files:**
- Create: `extension/README.md`
- Modify: `README.md`

- [x] Document unpacked installation, mock-server startup, token setup, and known limitations.
- [x] Run `npm test`.
- [x] Run `npm run typecheck`.
- [x] Run `npm run build`.
