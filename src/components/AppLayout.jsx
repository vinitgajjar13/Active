import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/faculty": "Faculty",
  "/attendance": "Attendance",
  "/message-template": "Message Template",
  "/whatsapp-logs": "WhatsApp Logs",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="app-shell__content">
        <div className="content-panel">
          <Topbar
            title={pageTitles[location.pathname] || "Dashboard"}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="page-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
