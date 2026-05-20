import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import { getSettings, updateSettings } from "../lib/api";

export default function SettingsPage() {
  const { token } = useAuth();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await getSettings(token);
        if (!cancelled) {
          setForm(response.data);
          setError("");
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateSettings(token, form);
      setForm(response.data);
      setSuccess("Settings saved");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSaving(false);
    }
  }

  if (!form) {
    return (
      <div className="page-stack">
        <SectionCard title="Settings">
          <p>Loading settings...</p>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <SectionCard title="Application Settings">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>School Name</span>
            <input
              type="text"
              value={form.schoolName || ""}
              onChange={(event) =>
                setForm((current) => ({ ...current, schoolName: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span>Default Country Code</span>
            <input
              type="text"
              value={form.defaultCountryCode || ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  defaultCountryCode: event.target.value,
                }))
              }
            />
          </label>

          <label className="field">
            <span>Queue Delay Min (sec)</span>
            <input
              type="number"
              value={form.queueDelayMinSec ?? 0}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  queueDelayMinSec: Number(event.target.value),
                }))
              }
            />
          </label>

          <label className="field">
            <span>Queue Delay Max (sec)</span>
            <input
              type="number"
              value={form.queueDelayMaxSec ?? 0}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  queueDelayMaxSec: Number(event.target.value),
                }))
              }
            />
          </label>

          <label className="field">
            <span>Batch Size</span>
            <input
              type="number"
              value={form.batchSize ?? 0}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  batchSize: Number(event.target.value),
                }))
              }
            />
          </label>

          <label className="field">
            <span>Batch Pause (sec)</span>
            <input
              type="number"
              value={form.batchPauseSeconds ?? 0}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  batchPauseSeconds: Number(event.target.value),
                }))
              }
            />
          </label>

          <label className="field">
            <span>Hourly Limit</span>
            <input
              type="number"
              value={form.hourlyLimit ?? 0}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  hourlyLimit: Number(event.target.value),
                }))
              }
            />
          </label>

          <label className="field">
            <span>Max Retries</span>
            <input
              type="number"
              value={form.maxRetries ?? 0}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  maxRetries: Number(event.target.value),
                }))
              }
            />
          </label>

          <label className="field field--full">
            <span>Default Result Message Template</span>
            <textarea
              rows="10"
              value={form.resultMessageTemplate || ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  resultMessageTemplate: event.target.value,
                }))
              }
            />
          </label>

          <label className="field field--full">
            <span>Attendance Message Template</span>
            <textarea
              rows="8"
              value={form.attendanceMessageTemplate || ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  attendanceMessageTemplate: event.target.value,
                }))
              }
            />
          </label>

          <div className="action-row">
            <button className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
            {success ? <span className="inline-note">{success}</span> : null}
          </div>
        </form>
      </SectionCard>

      {error ? <div className="alert alert--error">{error}</div> : null}
    </div>
  );
}
