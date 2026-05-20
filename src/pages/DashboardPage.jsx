import FacultyTable from "../components/FacultyTable";
import DonutChart from "../components/DonutChart";
import { CalendarIcon, ChevronDownIcon, InfoIcon } from "../components/icons";
import LineChart from "../components/LineChart";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import {
  attendanceSummary,
  facultyAttendance,
  statCards,
  weeklyTrend,
} from "../data/dashboardData";

export default function DashboardPage() {
  return (
    <div className="page-stack">
      <div className="dashboard-date-row">
        <div className="date-chip">
          <CalendarIcon className="icon icon--sm" />
          <span>22 May 2024, Wednesday</span>
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="dashboard-charts">
        <SectionCard
          title="Attendance Overview (This Week)"
          action={
            <button className="select-chip">
              <span>This Week</span>
              <ChevronDownIcon className="icon icon--xs" />
            </button>
          }
        >
          <LineChart data={weeklyTrend} />
        </SectionCard>

        <SectionCard title="Attendance Summary">
          <DonutChart data={attendanceSummary} />
        </SectionCard>
      </div>

      <SectionCard title="Faculty Attendance">
        <FacultyTable records={facultyAttendance} />
      </SectionCard>

      <div className="info-strip">
        <InfoIcon className="icon icon--sm" />
        <span>
          Attendance marked will be sent automatically via WhatsApp to the respective faculty.
        </span>
      </div>
    </div>
  );
}
