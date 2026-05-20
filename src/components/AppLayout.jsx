import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../context/AuthContext";
import { getWhatsAppStatus } from "../lib/api";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/attendance": "Attendance",
  "/whatsapp": "WhatsApp QR",
  "/bulk-upload": "Student Import",
  "/whatsapp-logs": "Message Logs",
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
    </div>
  );
}
