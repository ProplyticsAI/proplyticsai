import { Database, ExternalLink, Save, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { sendToBackground } from "../shared/chromeRuntime";
import { MESSAGE_TYPES, type VerifyTokenResponse } from "../shared/messages";
import type { ExtensionState, StoredSettings } from "../shared/types";

export function OptionsApp() {
  const [form, setForm] = useState<StoredSettings | null>(null);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    sendToBackground<ExtensionState>({ type: MESSAGE_TYPES.GET_STATE })
      .then((state) => setForm(state.settings))
      .catch((error) => setStatus(error.message));
  }, []);

  const update = (key: keyof StoredSettings, value: string) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form) {
      return;
    }

    setBusy(true);
    setStatus("");
    try {
      await sendToBackground<StoredSettings>({
        type: MESSAGE_TYPES.SAVE_SETTINGS,
        settings: form
      });
      setStatus("Einstellungen gespeichert.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Speichern fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (!form) {
      return;
    }
    setBusy(true);
    setStatus("");
    try {
      const response = await sendToBackground<VerifyTokenResponse>({
        type: MESSAGE_TYPES.VERIFY_TOKEN,
        settings: form
      });
      setForm(response.settings);
      setStatus(`Verbunden als ${response.user.name}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Token konnte nicht verifiziert werden.");
    } finally {
      setBusy(false);
    }
  };

  if (!form) {
    return <main className="options-shell">Einstellungen werden geladen...</main>;
  }

  return (
    <main className="options-shell">
      <header className="options-header">
        <div>
          <div className="brand">Proplytic.ai</div>
          <h1>Extension-Einstellungen</h1>
        </div>
        <ShieldCheck size={28} />
      </header>

      <form className="settings-form" onSubmit={save}>
        <label>
          <span>Personal-Access-Token</span>
          <input
            type="password"
            value={form.token}
            autoComplete="off"
            placeholder="mock-valid-token"
            onChange={(event) => update("token", event.target.value)}
          />
        </label>

        <label>
          <span>
            <Database size={15} />
            API-Basis-URL
          </span>
          <input
            type="url"
            value={form.apiBaseUrl}
            onChange={(event) => update("apiBaseUrl", event.target.value)}
          />
        </label>

        <label>
          <span>
            <ExternalLink size={15} />
            Plattform-URL
          </span>
          <input
            type="url"
            value={form.appBaseUrl}
            onChange={(event) => update("appBaseUrl", event.target.value)}
          />
        </label>

        {form.connectedUser ? (
          <div className="connected-box">
            Verbunden als <strong>{form.connectedUser.name}</strong>
          </div>
        ) : null}

        {status ? <div className="notice info">{status}</div> : null}

        <div className="form-actions">
          <button className="secondary-button" type="submit" disabled={busy}>
            <Save size={16} />
            Speichern
          </button>
          <button className="primary-button" type="button" onClick={verify} disabled={busy}>
            <ShieldCheck size={16} />
            Verbindung testen
          </button>
        </div>
      </form>
    </main>
  );
}
