import {
  Check,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  Send,
  Settings,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { sendToBackground } from "../shared/chromeRuntime";
import { MESSAGE_TYPES } from "../shared/messages";
import type {
  ExtensionState,
  Listing,
  ReviewStatus,
  StoredImportRun,
  ValuationResultItem
} from "../shared/types";

interface PopupAppProps {
  surface: "popup" | "sidepanel";
}

interface Notice {
  kind: "success" | "error" | "info";
  text: string;
}

export function PopupApp({ surface }: PopupAppProps) {
  const [state, setState] = useState<ExtensionState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const load = async () => {
    const nextState = await sendToBackground<ExtensionState>({
      type: MESSAGE_TYPES.GET_STATE
    });
    setState(nextState);
  };

  useEffect(() => {
    load().catch((error) =>
      setNotice({ kind: "error", text: error.message })
    );
    const onChanged = () => load().catch(() => undefined);
    chrome.storage.onChanged.addListener(onChanged);
    return () => chrome.storage.onChanged.removeListener(onChanged);
  }, []);

  const resultItems = useMemo(() => flattenResults(state?.imports ?? []), [state]);

  const runAction = async (
    name: string,
    action: () => Promise<Notice | void>
  ) => {
    setBusy(name);
    setNotice(null);
    try {
      const nextNotice = await action();
      if (nextNotice) {
        setNotice(nextNotice);
      }
      await load();
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Aktion fehlgeschlagen."
      });
    } finally {
      setBusy(null);
    }
  };

  const queue = state?.queue ?? [];
  const imports = state?.imports ?? [];
  const connectedUser = state?.settings.connectedUser;

  return (
    <main className={`extension-shell ${surface}`}>
      <header className="topbar">
        <div>
          <div className="brand">Proplytic.ai</div>
          <h1>Bulk-Import</h1>
        </div>
        <button
          className="icon-button"
          title="Einstellungen öffnen"
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          <Settings size={18} />
        </button>
      </header>

      <section className="status-strip">
        <span className={connectedUser ? "dot ok" : "dot"} />
        <span>
          {connectedUser
            ? `Verbunden als ${connectedUser.name}`
            : "Noch nicht verbunden"}
        </span>
      </section>

      {notice ? (
        <div className={`notice ${notice.kind}`}>{notice.text}</div>
      ) : null}

      <section className="action-row">
        <button
          className="primary-button"
          disabled={Boolean(busy)}
          onClick={() =>
            runAction("collect", async () => {
              const result = await sendToBackground<{
                added: number;
                total: number;
                listings: Listing[];
              }>({ type: MESSAGE_TYPES.EXTRACT_CURRENT_TAB });
              return {
                kind: "success",
                text: `${result.added} neue Inserate gesammelt (${result.total} in der Liste).`
              };
            })
          }
        >
          {busy === "collect" ? <Loader2 className="spin" size={16} /> : <Search size={16} />}
          Seite sammeln
        </button>
        <button
          className="secondary-button"
          disabled={Boolean(busy) || queue.length === 0}
          onClick={() =>
            runAction("send", async () => {
              const result = await sendToBackground<{ imports: StoredImportRun[] }>({
                type: MESSAGE_TYPES.SEND_QUEUE
              });
              return {
                kind: "success",
                text: `${result.imports.length} Import-Job(s) abgeschlossen.`
              };
            })
          }
        >
          {busy === "send" ? <Loader2 className="spin" size={16} /> : <Send size={16} />}
          Senden
        </button>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Sammelliste</h2>
          <span>{queue.length}</span>
        </div>
        {queue.length === 0 ? (
          <EmptyState text="Noch keine Inserate gesammelt." />
        ) : (
          <div className="item-list">
            {queue.map((listing) => (
              <ListingRow
                key={listing.sourceUrl}
                listing={listing}
                disabled={Boolean(busy)}
                onRemove={() =>
                  runAction("remove", () =>
                    sendToBackground<ExtensionState>({
                      type: MESSAGE_TYPES.REMOVE_LISTING,
                      sourceUrl: listing.sourceUrl
                    }).then(() => ({
                      kind: "info",
                      text: "Inserat entfernt."
                    }))
                  )
                }
              />
            ))}
          </div>
        )}
        {queue.length > 0 ? (
          <button
            className="text-button"
            disabled={Boolean(busy)}
            onClick={() =>
              runAction("clear", () =>
                sendToBackground<ExtensionState>({
                  type: MESSAGE_TYPES.CLEAR_QUEUE
                }).then(() => ({ kind: "info", text: "Sammelliste geleert." }))
              )
            }
          >
            Liste leeren
          </button>
        ) : null}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Import-Status</h2>
          <button
            className="icon-button small"
            title="Status aktualisieren"
            disabled={Boolean(busy)}
            onClick={() => runAction("refresh", load)}
          >
            <RefreshCw size={15} />
          </button>
        </div>
        {imports.length === 0 ? (
          <EmptyState text="Noch keine Uploads gestartet." />
        ) : (
          <div className="job-list">
            {imports.slice(0, 4).map((run) => (
              <div className="job-row" key={run.id}>
                <div>
                  <strong>{run.label || run.id}</strong>
                  <span>{statusLabel(run.status)}</span>
                </div>
                <progress
                  max={run.totalItems || 1}
                  value={run.processedItems}
                  aria-label="Importfortschritt"
                />
                <small>
                  {run.processedItems}/{run.totalItems} verarbeitet
                  {run.failedItems ? ` · ${run.failedItems} fehlgeschlagen` : ""}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Treffer</h2>
          <span>Score &gt;= 70</span>
        </div>
        {resultItems.length === 0 ? (
          <EmptyState text="Nach einem Upload erscheinen hier priorisierte Treffer." />
        ) : (
          <div className="item-list">
            {resultItems.map(({ importId, item }) => (
              <ResultRow
                key={`${importId}:${item.listingId}`}
                item={item}
                disabled={Boolean(busy)}
                onReview={(reviewStatus) =>
                  runAction("review", () =>
                    sendToBackground({
                      type: MESSAGE_TYPES.UPDATE_RESULT_REVIEW,
                      importId,
                      listingId: item.listingId,
                      reviewStatus
                    }).then(() => ({
                      kind: "success",
                      text:
                        reviewStatus === "shortlisted"
                          ? "Treffer als interessant markiert."
                          : "Treffer verworfen."
                    }))
                  )
                }
                onOpen={() =>
                  runAction("open", () =>
                    sendToBackground({
                      type: MESSAGE_TYPES.OPEN_PLATFORM,
                      importId
                    }).then(() => undefined)
                  )
                }
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ListingRow({
  listing,
  disabled,
  onRemove
}: {
  listing: Listing;
  disabled: boolean;
  onRemove: () => void;
}) {
  return (
    <article className="listing-card">
      <div className="card-main">
        <h3>{listing.title}</h3>
        <p>{formatAddress(listing)}</p>
        <small>
          {formatPrice(listing.askingPrice)} · {formatNumber(listing.livingSpace)} m² · {listing.sourcePortal}
        </small>
      </div>
      <button
        className="icon-button danger"
        title="Inserat entfernen"
        disabled={disabled}
        onClick={onRemove}
      >
        <Trash2 size={16} />
      </button>
    </article>
  );
}

function ResultRow({
  item,
  disabled,
  onReview,
  onOpen
}: {
  item: ValuationResultItem;
  disabled: boolean;
  onReview: (reviewStatus: ReviewStatus) => void;
  onOpen: () => void;
}) {
  return (
    <article className="result-card">
      <div className="score-block">
        <strong>{item.score}</strong>
        <span>Score</span>
      </div>
      <div className="card-main">
        <h3>{formatPrice(item.valuation.ergebnis)}</h3>
        <p>{item.scoreReason}</p>
        <small>
          vs. Angebot: {formatSigned(item.vsAskingPrice.absolut)} ({formatNumber(item.vsAskingPrice.prozent)} %)
        </small>
        <div className="review-actions">
          <button
            className="mini-button"
            disabled={disabled || item.reviewStatus === "shortlisted"}
            onClick={() => onReview("shortlisted")}
          >
            <Check size={14} />
            Interessant
          </button>
          <button
            className="mini-button muted"
            disabled={disabled || item.reviewStatus === "dismissed"}
            onClick={() => onReview("dismissed")}
          >
            <X size={14} />
            Verwerfen
          </button>
          <button className="icon-button small" title="In Proplytic.ai öffnen" onClick={onOpen}>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty-state">{text}</div>;
}

function flattenResults(imports: StoredImportRun[]) {
  return imports.flatMap((run) =>
    run.resultItems.map((item) => ({
      importId: run.id,
      item
    }))
  );
}

function statusLabel(status: StoredImportRun["status"]) {
  const labels: Record<StoredImportRun["status"], string> = {
    queued: "Wartet",
    processing: "In Bearbeitung",
    completed: "Abgeschlossen",
    partial: "Teilweise abgeschlossen",
    failed: "Fehlgeschlagen"
  };
  return labels[status];
}

function formatAddress(listing: Listing) {
  const { street, zip, city } = listing.address;
  return `${street}, ${zip} ${city}`;
}

function formatPrice(value: number) {
  return `${Math.round(value).toLocaleString("de-DE")} €`;
}

function formatSigned(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${formatPrice(value)}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}
