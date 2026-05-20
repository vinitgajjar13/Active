import { WhatsAppIcon } from "./icons";

function FacultyAvatar({ initials, tone }) {
  return <span className={`faculty-avatar faculty-avatar--${tone}`}>{initials}</span>;
}

function StatusPill({ status }) {
  return (
    <span className={`status-pill status-pill--${status.toLowerCase()}`}>
      <span className="status-pill__dot" />
      {status}
    </span>
  );
}

function AttendanceControls() {
  return (
    <div className="attendance-controls">
      <button className="btn-tag btn-tag--present">Present</button>
      <button className="btn-tag btn-tag--absent">Absent</button>
    </div>
  );
}

export default function FacultyTable({ records }) {
  return (
    <div className="faculty-table-wrap">
      <div className="faculty-table faculty-table--desktop">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Faculty Name</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Attendance</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>
                  <div className="faculty-cell faculty-cell--person">
                    <FacultyAvatar initials={record.initials} tone={record.avatar} />
                    <span>{record.name}</span>
                  </div>
                </td>
                <td>{record.phone}</td>
                <td>
                  <StatusPill status={record.status} />
                </td>
                <td>
                  <AttendanceControls />
                </td>
                <td>{record.updatedAt}</td>
                <td>
                  <button className="icon-button icon-button--ghost">
                    <WhatsAppIcon className="icon icon--sm" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="faculty-table faculty-table--mobile">
        {records.map((record) => (
          <article key={record.id} className="faculty-mobile-card">
            <div className="faculty-cell faculty-cell--person">
              <FacultyAvatar initials={record.initials} tone={record.avatar} />
              <div>
                <strong>{record.name}</strong>
                <p>{record.phone}</p>
              </div>
            </div>
            <div className="faculty-mobile-card__meta">
              <StatusPill status={record.status} />
              <span>{record.updatedAt}</span>
            </div>
            <div className="faculty-mobile-card__actions">
              <AttendanceControls />
              <button className="icon-button icon-button--ghost">
                <WhatsAppIcon className="icon icon--sm" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
