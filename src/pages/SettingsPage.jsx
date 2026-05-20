import SectionCard from "../components/SectionCard";
import { settingsGroups } from "../data/dashboardData";

export default function SettingsPage() {
  return (
    <div className="page-stack">
      <div className="settings-grid">
        {settingsGroups.map((group) => (
          <SectionCard key={group.title} title={group.title}>
            <div className="settings-list">
              {group.items.map((item) => (
                <div key={item.label} className="settings-list__item">
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </div>
                  <button className="btn-secondary">Change</button>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
