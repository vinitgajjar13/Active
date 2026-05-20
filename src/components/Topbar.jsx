import { BellIcon, ChevronDownIcon, MenuIcon, WhatsAppIcon } from "./icons";

export default function Topbar({ title, onMenuClick }) {
  return (
    <header className="topbar">
      <div className="topbar__title-group">
        <button className="icon-button icon-button--menu" onClick={onMenuClick}>
          <MenuIcon className="icon icon--sm" />
        </button>
        <h2>{title}</h2>
      </div>

      <div className="topbar__actions">
        <div className="whatsapp-chip">
          <WhatsAppIcon className="icon icon--sm" />
          <span className="status-dot status-dot--green" />
          <span>WhatsApp Connected</span>
        </div>

        <button className="icon-button icon-button--badge">
          <BellIcon className="icon icon--sm" />
          <span className="notification-badge">3</span>
        </button>

        <div className="profile-chip">
          <span className="profile-chip__avatar">A</span>
          <div>
            <strong>Admin</strong>
            <span>Super Admin</span>
          </div>
          <ChevronDownIcon className="icon icon--xs" />
        </div>
      </div>
    </header>
  );
}
