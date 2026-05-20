import LineChart from "../components/LineChart";
import SectionCard from "../components/SectionCard";
import { reportCards, weeklyTrend } from "../data/dashboardData";

export default function ReportsPage() {
  return (
    <div className="page-stack">
      <div className="metric-grid metric-grid--triple">
        {reportCards.map((card) => (
          <article key={card.title} className="metric-card">
            <p>{card.title}</p>
            <h3>{card.value}</h3>
            <span>{card.detail}</span>
          </article>
        ))}
      </div>

      <SectionCard title="Performance Report">
        <LineChart data={weeklyTrend} />
      </SectionCard>
    </div>
  );
}
