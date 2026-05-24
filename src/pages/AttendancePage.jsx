import { useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import {
  getAttendanceOverview,
  getStudentOverview,
  getStudents,
  submitAttendance,
} from "../lib/api";
import { getStandardHeading, STANDARD_OPTIONS } from "../data/standards";

function getTodayValue() {
  return new Date().toISOString().slice(0, 10);
}

function buildCounts(items) {
  const countMap = new Map(items.map((item) => [item.standard, item.count]));

  return STANDARD_OPTIONS.map((option) => ({
    ...option,
    count: countMap.get(option.value) || 0,
  }));
}

export default function AttendancePage() {
  const { token } = useAuth();
  const formRef = useRef(null);
  const [overview, setOverview] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState("LKG");

  const handleStandardSelect = (stdValue) => {
    setSelectedStandard(stdValue);
    if (window.innerWidth <= 760) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };
  const [attendanceDate, setAttendanceDate] = useState(getTodayValue());
  const [students, setStudents] = useState([]);
  const [standardCounts, setStandardCounts] = useState(buildCounts([]));
  const [attendanceMap, setAttendanceMap] = useState({});
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const [attendanceResponse, studentsResponse] = await Promise.all([
          getAttendanceOverview(token),
          getStudentOverview(token),
        ]);

        if (cancelled) {
          return;
        }

        setOverview(attendanceResponse.data);
        setStandardCounts(buildCounts(studentsResponse.data.standards || []));
        setError("");
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message);
        }
      }
    }

    void loadInitial();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    async function loadStudents() {
      setLoadingStudents(true);

      try {
        const response = await getStudents(token, {
          standard: selectedStandard,
          limit: 500,
        });

        if (cancelled) {
          return;
        }

        setStudents(response.data.items);
        setAttendanceMap(
          response.data.items.reduce((accumulator, student) => {
            accumulator[student._id] = "present";
            return accumulator;
          }, {})
        );
        setError("");
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingStudents(false);
        }
      }
    }

    void loadStudents();

    return () => {
      cancelled = true;
    };
  }, [selectedStandard, token]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) =>
      [student.studentName, student.parentName, student.rollNumber, student.parentPhoneNumber]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [search, students]);

  const absentStudentIds = Object.entries(attendanceMap)
    .filter(([, value]) => value === "absent")
    .map(([studentId]) => studentId);

  async function refreshOverview() {
    const [attendanceResponse, studentsResponse] = await Promise.all([
      getAttendanceOverview(token),
      getStudentOverview(token),
    ]);

    setOverview(attendanceResponse.data);
    setStandardCounts(buildCounts(studentsResponse.data.standards || []));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const response = await submitAttendance(token, {
        standard: selectedStandard,
        attendanceDate,
        absentStudentIds,
      });

      setSuccess(response.message || "Attendance submitted successfully");
      await refreshOverview();
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-stack">
      <SectionCard title="Select Standard For Attendance">
        <div className="standard-grid">
          {standardCounts.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`standard-card ${selectedStandard === item.value ? "is-active" : ""}`}
              onClick={() => handleStandardSelect(item.value)}
            >
              <span className="standard-card__label">{item.label}</span>
              <strong className="standard-card__value">{item.count}</strong>
              <span className="standard-card__meta">students</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="split-grid" ref={formRef}>
        <SectionCard title={`${getStandardHeading(selectedStandard)} Attendance`}>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="field">
                <span>Standard</span>
                <input type="text" value={getStandardHeading(selectedStandard)} readOnly />
              </label>

              <label className="field">
                <span>Attendance Date</span>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(event) => setAttendanceDate(event.target.value)}
                />
              </label>
            </div>

            <label className="field">
              <span>Search Student</span>
              <input
                type="text"
                placeholder="Search by name, roll number, or parent number"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <div className="detail-list">
              <div className="detail-list__item">
                <span>Total Students</span>
                <strong>{students.length}</strong>
              </div>
              <div className="detail-list__item">
                <span>Present</span>
                <strong>{students.length - absentStudentIds.length}</strong>
              </div>
              <div className="detail-list__item">
                <span>Absent</span>
                <strong>{absentStudentIds.length}</strong>
              </div>
              <div className="detail-list__item">
                <span>WhatsApp Messages</span>
                <strong>{absentStudentIds.length}</strong>
              </div>
            </div>

            <div className="action-row action-row--wrap">
              <button className="btn-primary" disabled={busy || loadingStudents || !students.length}>
                {busy ? "Submitting..." : "Final Submit"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                disabled={busy || !students.length}
                onClick={() =>
                  setAttendanceMap(
                    students.reduce((accumulator, student) => {
                      accumulator[student._id] = "present";
                      return accumulator;
                    }, {})
                  )
                }
              >
                Mark All Present
              </button>
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Today's Summary">
          <div className="detail-list">
            <div className="detail-list__item">
              <span>Date</span>
              <strong>{overview?.today?.attendanceDateKey || "-"}</strong>
            </div>
            <div className="detail-list__item">
              <span>Standards Submitted</span>
              <strong>{overview?.today?.sessionsMarked ?? 0}</strong>
            </div>
            <div className="detail-list__item">
              <span>Present Count</span>
              <strong>{overview?.today?.presentCount ?? 0}</strong>
            </div>
            <div className="detail-list__item">
              <span>Absent Count</span>
              <strong>{overview?.today?.absentCount ?? 0}</strong>
            </div>
          </div>

          <div className="inline-note">
            Final submit pachi je absent students hase ena parent number par WhatsApp message queue thai jashe.
          </div>

          {success ? <div className="inline-note">{success}</div> : null}
          {error ? <div className="alert alert--error">{error}</div> : null}
        </SectionCard>
      </div>

      <SectionCard title={`${getStandardHeading(selectedStandard)} Student Attendance List`}>
        {/* Desktop View */}
        <div className="simple-table simple-table--desktop">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Parent Name</th>
                <th>Parent WhatsApp</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {loadingStudents ? (
                <tr>
                  <td className="table-empty-cell" colSpan="5">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length ? (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.rollNumber}</td>
                    <td>{student.studentName}</td>
                    <td>{student.parentName}</td>
                    <td>{student.parentPhoneNumber}</td>
                    <td>
                      <div className="attendance-radio-group">
                        <label className="attendance-radio">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendanceMap[student._id] !== "absent"}
                            onChange={() =>
                              setAttendanceMap((current) => ({
                                ...current,
                                [student._id]: "present",
                              }))
                            }
                          />
                          <span>Present</span>
                        </label>
                        <label className="attendance-radio attendance-radio--absent">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            checked={attendanceMap[student._id] === "absent"}
                            onChange={() =>
                              setAttendanceMap((current) => ({
                                ...current,
                                [student._id]: "absent",
                              }))
                            }
                          />
                          <span>Absent</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="table-empty-cell" colSpan="5">
                    No students found for {getStandardHeading(selectedStandard)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="simple-table--mobile student-mobile-list">
          {loadingStudents ? (
            <div className="table-empty-cell">Loading students...</div>
          ) : filteredStudents.length ? (
            filteredStudents.map((student) => (
              <div key={student._id} className="student-mobile-card">
                <div className="student-mobile-card__header">
                  <span className="student-mobile-card__roll">Roll #{student.rollNumber}</span>
                  <strong className="student-mobile-card__name">{student.studentName}</strong>
                </div>
                <div className="student-mobile-card__details">
                  <div>
                    <span>Parent</span>
                    <strong>{student.parentName}</strong>
                  </div>
                  <div>
                    <span>WhatsApp</span>
                    <strong>{student.parentPhoneNumber}</strong>
                  </div>
                </div>
                <div className="student-mobile-card__actions">
                  <div className="attendance-radio-group">
                    <label className="attendance-radio">
                      <input
                        type="radio"
                        name={`attendance-mobile-${student._id}`}
                        checked={attendanceMap[student._id] !== "absent"}
                        onChange={() =>
                          setAttendanceMap((current) => ({
                            ...current,
                            [student._id]: "present",
                          }))
                        }
                      />
                      <span>Present</span>
                    </label>
                    <label className="attendance-radio attendance-radio--absent">
                      <input
                        type="radio"
                        name={`attendance-mobile-${student._id}`}
                        checked={attendanceMap[student._id] === "absent"}
                        onChange={() =>
                          setAttendanceMap((current) => ({
                            ...current,
                            [student._id]: "absent",
                          }))
                        }
                      />
                      <span>Absent</span>
                    </label>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="table-empty-cell">
              No students found for {getStandardHeading(selectedStandard)}
            </div>
          )}
        </div>
      </SectionCard>

    </div>
  );
}
