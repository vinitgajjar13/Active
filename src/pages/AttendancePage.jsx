import DonutChart from "../components/DonutChart";
import LineChart from "../components/LineChart";
import SectionCard from "../components/SectionCard";
import { attendanceLog, attendanceSummary, weeklyTrend } from "../data/dashboardData";

export default function AttendancePage() {
  return (
    <div className="page-stack">
      <div className="dashboard-charts">
        <SectionCard title="Weekly Attendance Trend">
          <LineChart data={weeklyTrend} />
        </SectionCard>
        <SectionCard title="Current Attendance Split">
          <DonutChart data={attendanceSummary} />
        </SectionCard>
      </div>

      <SectionCard title="Attendance Register">
        <div className="simple-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Marked At</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {attendanceLog.map((item) => (
                <tr key={item.date}>
                  <td>{item.date}</td>
                  <td>{item.marked}</td>
                  <td>{item.present}</td>
                  <td>{item.absent}</td>
                  <td>{item.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
