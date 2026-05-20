import SectionCard from "../components/SectionCard";
import { facultyDirectory, facultyStats } from "../data/dashboardData";

export default function FacultyPage() {
  return (
    <div className="page-stack">
      <div className="metric-grid metric-grid--triple">
        {facultyStats.map((stat) => (
          <article key={stat.label} className="metric-card">
            <p>{stat.label}</p>
            <h3>{stat.value}</h3>
            <span>{stat.trend}</span>
          </article>
        ))}
      </div>

      <SectionCard title="Faculty Directory">
        <div className="simple-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {facultyDirectory.map((person) => (
                <tr key={person.phone}>
                  <td>{person.name}</td>
                  <td>{person.role}</td>
                  <td>{person.department}</td>
                  <td>{person.phone}</td>
                  <td>{person.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
