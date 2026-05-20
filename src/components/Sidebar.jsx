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

export default function Sidebar({ mobileOpen, onClose, onSignOut }) {
  return (
    <>
      <div className={`sidebar-backdrop ${mobileOpen ? "is-visible" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="sidebar__brand">
          <BrandIcon className="sidebar__brand-mark" />
          <div className="sidebar__brand-copy">
            <strong>Active</strong>
            <span>Education</span>
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

        <div className="sidebar__footer">
          <button className="sidebar__signout" onClick={onSignOut}>
            <LogOutIcon className="icon icon--sm" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
