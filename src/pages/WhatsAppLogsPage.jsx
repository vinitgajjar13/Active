import SectionCard from "../components/SectionCard";
import { whatsappLogs } from "../data/dashboardData";

export default function WhatsAppLogsPage() {
  return (
    <div className="page-stack">
      <SectionCard title="Recent WhatsApp Activity">
        <div className="simple-table">
          <table>
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Template</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {whatsappLogs.map((log) => (
                <tr key={`${log.recipient}-${log.time}`}>
                  <td>{log.recipient}</td>
                  <td>{log.template}</td>
                  <td>
                    <span className={`badge badge--${log.status.toLowerCase()}`}>{log.status}</span>
                  </td>
                  <td>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
