import { Outlet, useLocation, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../context/AuthContext";
import { getWhatsAppStatus } from "../lib/api";
import {
  DashboardIcon,
  AttendanceIcon,
  TemplateIcon,
  WhatsAppIcon,
} from "./icons";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/attendance": "Attendance",
  "/whatsapp": "WhatsApp QR",
  "/bulk-upload": "Student Import",
  "/settings": "Settings",
};

export default function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [whatsappStatus, setWhatsAppStatus] = useState(null);
  const { token, user, logout } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await getWhatsAppStatus(token);
        if (!cancelled) {
          setWhatsAppStatus(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          setWhatsAppStatus(null);
        }
      }
    }

    void loadStatus();
    const intervalId = window.setInterval(loadStatus, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [token]);

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSignOut={logout}
      />

      <div className="app-shell__content">
        <div className="content-panel">
          <Topbar
            title={pageTitles[location.pathname] || "Dashboard"}
            onMenuClick={() => setMobileOpen(true)}
            user={user}
            whatsappStatus={whatsappStatus}
            onSignOut={logout}
          />
          <main className="page-content">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Sticky Tab Bar */}
      <nav className="mobile-tab-bar">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `mobile-tab-item ${isActive ? "is-active" : ""}`}
        >
          <DashboardIcon className="icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/attendance"
          className={({ isActive }) => `mobile-tab-item ${isActive ? "is-active" : ""}`}
        >
          <AttendanceIcon className="icon" />
          <span>Attendance</span>
        </NavLink>
        <NavLink
          to="/bulk-upload"
          className={({ isActive }) => `mobile-tab-item ${isActive ? "is-active" : ""}`}
        >
          <TemplateIcon className="icon" />
          <span>Import</span>
        </NavLink>
        <NavLink
          to="/whatsapp"
          className={({ isActive }) => `mobile-tab-item ${isActive ? "is-active" : ""}`}
        >
          <WhatsAppIcon className="icon" />
          <span>Session</span>
        </NavLink>

      </nav>
    </div>
  );
}
