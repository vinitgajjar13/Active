import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AttendancePage from "./pages/AttendancePage";
import DashboardPage from "./pages/DashboardPage";
import FacultyPage from "./pages/FacultyPage";
import MessageTemplatePage from "./pages/MessageTemplatePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import WhatsAppLogsPage from "./pages/WhatsAppLogsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/faculty" element={<FacultyPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/message-template" element={<MessageTemplatePage />} />
          <Route path="/whatsapp-logs" element={<WhatsAppLogsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
