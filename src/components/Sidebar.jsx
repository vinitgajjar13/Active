import { NavLink } from "react-router-dom";
import { navItems } from "../data/dashboardData";
import {
  AttendanceIcon,
  BrandIcon,
  DashboardIcon,
  FacultyIcon,
  LogOutIcon,
  PhoneIcon,
  ReportsIcon,
  SettingsIcon,
  TemplateIcon,
  WhatsAppIcon,
} from "./icons";

const iconMap = {
  dashboard: DashboardIcon,
  faculty: FacultyIcon,
  attendance: AttendanceIcon,
  template: TemplateIcon,
  whatsapp: PhoneIcon,
  reports: ReportsIcon,
  settings: SettingsIcon,
};

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <div className={`sidebar-backdrop ${mobileOpen ? "is-visible" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="sidebar__brand">
          <BrandIcon className="sidebar__brand-icon" />
          <div>
            <h1>School Notifier</h1>
            <p>WhatsApp Automation</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon] || DashboardIcon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar__nav-item ${isActive ? "is-active" : ""}`.trim()
                }
                onClick={onClose}
              >
                <Icon className="icon icon--sm" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar__promo">
          <div className="sidebar__promo-art">
            <div className="sidebar__promo-bubble">
              <WhatsAppIcon className="icon icon--promo" />
            </div>
          </div>
          <h3>Automate WhatsApp messages instantly</h3>
          <button className="sidebar__promo-link">Learn More</button>
        </div>

        <button className="sidebar__signout">
          <LogOutIcon className="icon icon--sm" />
          <span>Sign Out</span>
        </button>
      </aside>
    </>
  );
}
