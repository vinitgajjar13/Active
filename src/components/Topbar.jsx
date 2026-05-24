import { MenuIcon, WhatsAppIcon, LogOutIcon } from "./icons";

function resolveStatusMeta(status) {
  switch (status) {
    case "connected":
      return { label: "WhatsApp Connected", tone: "green" };
    case "qr_waiting":
      return { label: "QR Waiting", tone: "amber" };
    case "authenticated":
    case "reconnecting":
    case "initializing":
      return { label: "Connecting", tone: "amber" };
    default:
      return { label: "WhatsApp Offline", tone: "red" };
  }
}

export default function Topbar({ title, onMenuClick, user, whatsappStatus, onSignOut }) {
  const statusMeta = resolveStatusMeta(whatsappStatus?.status);

  return (
    <header className="topbar">
      <div className="topbar__title-group">
        <button className="icon-button icon-button--menu" onClick={onMenuClick}>
          <MenuIcon className="icon icon--sm" />
        </button>
        <h2>{title}</h2>
      </div>

      <div className="topbar__actions">
        {/* <div className="whatsapp-chip">
          <WhatsAppIcon className="icon icon--sm" />
          <span className={`status-dot status-dot--${statusMeta.tone}`} />
          <span>{statusMeta.label}</span>
        </div> */}

        <button className="mobile-signout-btn" onClick={onSignOut} title="Sign Out">
          <LogOutIcon className="icon icon--sm" />
        </button>
      </div>
    </header>
  );
}
