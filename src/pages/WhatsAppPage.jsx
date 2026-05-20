import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import {
  disconnectWhatsApp,
  getWhatsAppQr,
  getWhatsAppStatus,
  restartWhatsApp,
  sendTestMessage,
} from "../lib/api";

export default function WhatsAppPage() {
  const { token } = useAuth();
  const [qrData, setQrData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [error, setError] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const [testForm, setTestForm] = useState({
    phoneNumber: "",
    message: "Testing WhatsApp integration from School Result Notification backend.",
  });
  const [testResult, setTestResult] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const statusResponse = await getWhatsAppStatus(token);
        if (cancelled) {
          return;
        }

        setStatusData(statusResponse.data);

        if (statusResponse.data.status === "connected") {
          setQrData(null);
        } else {
          const qrResponse = await getWhatsAppQr(token);
          if (!cancelled) {
            setQrData(qrResponse.data);
          }
        }

        if (!cancelled) {
          setError("");
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message);
        }
      }
    }

    void load();
    const intervalId = window.setInterval(load, 8000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [token]);

  async function handleAction(actionName, action) {
    setBusyAction(actionName);
    setError("");

    try {
      await action();
      const [statusResponse, qrResponse] = await Promise.all([
        getWhatsAppStatus(token),
        getWhatsAppQr(token),
      ]);
      setStatusData(statusResponse.data);
      setQrData(qrResponse.data);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setBusyAction("");
    }
  }

  async function handleTestMessage(event) {
    event.preventDefault();
    setBusyAction("send-test");
    setTestResult("");
    setError("");

    try {
      const response = await sendTestMessage(token, testForm);
      setTestResult(`Message sent to ${response.data.phoneNumber}`);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setBusyAction("");
    }
  }

  const displayStatus = statusData?.status || qrData?.status || "disconnected";

  return (
    <div className="page-stack">
      <div className="split-grid split-grid--hero">
        <SectionCard
          title="Scan WhatsApp QR"
          action={
            <div className="action-row action-row--inline">
              <button
                className="btn-secondary"
                onClick={() =>
                  handleAction("refresh", async () => {
                    return Promise.resolve();
                  })
                }
                disabled={Boolean(busyAction)}
              >
                Refresh
              </button>
              <button
                className="btn-primary"
                onClick={() => handleAction("restart", () => restartWhatsApp(token))}
                disabled={Boolean(busyAction)}
              >
                {busyAction === "restart" ? "Restarting..." : "Generate QR"}
              </button>
            </div>
          }
        >
          <div className="qr-panel">
            {qrData?.qrAvailable && qrData?.qr ? (
              <div className="qr-card">
                <img src={qrData.qr} alt="WhatsApp QR code" className="qr-image" />
                <div className="qr-scanline" />
              </div>
            ) : (
              <div className="qr-placeholder">
                <strong>{displayStatus}</strong>
                <span>
                  {displayStatus === "connected"
                    ? "WhatsApp is already connected on this device."
                    : "QR will appear here when the session needs authentication."}
                </span>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Connection Details">
          <div className="detail-list">
            <div className="detail-list__item">
              <span>Status</span>
              <strong>{displayStatus}</strong>
            </div>
            <div className="detail-list__item">
              <span>Phone number</span>
              <strong>{statusData?.phoneNumber || "Not linked"}</strong>
            </div>
            <div className="detail-list__item">
              <span>Client state</span>
              <strong>{statusData?.clientState || "Unknown"}</strong>
            </div>
            <div className="detail-list__item">
              <span>Last updated</span>
              <strong>{statusData?.lastSeenAt || "N/A"}</strong>
            </div>
          </div>

          <div className="action-row">
            <button
              className="btn-secondary"
              onClick={() => handleAction("restart", () => restartWhatsApp(token))}
              disabled={Boolean(busyAction)}
            >
              Reconnect
            </button>
            <button
              className="btn-secondary btn-secondary--danger"
              onClick={() => handleAction("logout", () => disconnectWhatsApp(token))}
              disabled={Boolean(busyAction)}
            >
              {busyAction === "logout" ? "Logging Out..." : "Logout Session"}
            </button>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Send Test Message">
        <form className="form-grid" onSubmit={handleTestMessage}>
          <label className="field">
            <span>Phone Number</span>
            <input
              type="text"
              placeholder="9876543210"
              value={testForm.phoneNumber}
              onChange={(event) =>
                setTestForm((current) => ({
                  ...current,
                  phoneNumber: event.target.value,
                }))
              }
            />
          </label>

          <label className="field field--full">
            <span>Message</span>
            <textarea
              rows="5"
              value={testForm.message}
              onChange={(event) =>
                setTestForm((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
            />
          </label>

          <div className="action-row">
            <button className="btn-primary" disabled={busyAction === "send-test"}>
              {busyAction === "send-test" ? "Sending..." : "Send Test Message"}
            </button>
            {testResult ? <span className="inline-note">{testResult}</span> : null}
          </div>
        </form>
      </SectionCard>

      {error ? <div className="alert alert--error">{error}</div> : null}
    </div>
  );
}
