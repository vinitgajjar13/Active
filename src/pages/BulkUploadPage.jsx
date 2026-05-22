import { useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import { getStudentOverview, getStudents, saveStudent } from "../lib/api";
import { getStandardHeading, STANDARD_OPTIONS } from "../data/standards";

const EMPTY_FORM = {
  studentName: "",
  rollNumber: "",
  parentName: "",
  parentPhoneNumber: "",
};

function buildCounts(items) {
  const countMap = new Map(items.map((item) => [item.standard, item.count]));

  return STANDARD_OPTIONS.map((option) => ({
    ...option,
    count: countMap.get(option.value) || 0,
  }));
}

export default function BulkUploadPage() {
  const { token } = useAuth();
  const formRef = useRef(null);
  const [selectedStandard, setSelectedStandard] = useState("LKG");

  const handleStandardSelect = (stdValue) => {
    setSelectedStandard(stdValue);
    if (window.innerWidth <= 760) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };
  const [students, setStudents] = useState([]);
  const [standardCounts, setStandardCounts] = useState(buildCounts([]));
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadStudents(activeStandard = selectedStandard) {
    setLoading(true);

    try {
      const response = await getStudents(token, {
        standard: activeStandard,
        limit: 500,
      });

      setStudents(response.data.items);
      setError("");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadCounts() {
    try {
      const response = await getStudentOverview(token);
      setStandardCounts(buildCounts(response.data.standards || []));
    } catch (nextError) {
      setError(nextError.message);
    }
  }

  useEffect(() => {
    void loadCounts();
  }, [token]);

  useEffect(() => {
    setSearch("");
    setSuccess("");
    void loadStudents(selectedStandard);
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

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const response = await saveStudent(token, {
        ...form,
        standard: selectedStandard,
      });

      setSuccess(response.message || "Student saved successfully");
      setForm(EMPTY_FORM);
      await Promise.all([loadStudents(selectedStandard), loadCounts()]);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-stack">
      <SectionCard title="Select Standard To Add Students">
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
        <SectionCard title={`${getStandardHeading(selectedStandard)} Student Entry`}>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="inline-note">
              Aa standard ma je student add karso ae entry aaj standard ma alag save thase.
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Student Name</span>
                <input
                  type="text"
                  value={form.studentName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, studentName: event.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Roll Number</span>
                <input
                  type="text"
                  value={form.rollNumber}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, rollNumber: event.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Parent Name</span>
                <input
                  type="text"
                  value={form.parentName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, parentName: event.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Parent Mobile Number</span>
                <input
                  type="text"
                  value={form.parentPhoneNumber}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      parentPhoneNumber: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <button className="btn-primary" disabled={busy}>
              {busy ? "Saving..." : `Add Student In ${getStandardHeading(selectedStandard)}`}
            </button>
          </form>

          {success ? <div className="inline-note">{success}</div> : null}
          {error ? <div className="alert alert--error">{error}</div> : null}
        </SectionCard>

        <SectionCard title={`${getStandardHeading(selectedStandard)} Summary`}>
          <div className="detail-list">
            <div className="detail-list__item">
              <span>Selected Standard</span>
              <strong>{getStandardHeading(selectedStandard)}</strong>
            </div>
            <div className="detail-list__item">
              <span>Total Students</span>
              <strong>{students.length}</strong>
            </div>
            <div className="detail-list__item">
              <span>Attendance Ready</span>
              <strong>{students.length ? "Yes" : "No"}</strong>
            </div>
            <div className="detail-list__item">
              <span>WhatsApp Parent Numbers</span>
              <strong>{students.filter((student) => student.parentPhoneNumber).length}</strong>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title={`${getStandardHeading(selectedStandard)} Students`}
        action={
          <div className="toolbar">
            <input
              className="toolbar__search"
              type="text"
              placeholder="Search student / parent / roll no"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        }
      >
        {/* Desktop View */}
        <div className="simple-table simple-table--desktop">
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Parent Name</th>
                <th>Parent WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="table-empty-cell" colSpan="4">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="table-empty-cell" colSpan="4">
                    No students added in {getStandardHeading(selectedStandard)} yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="simple-table--mobile student-mobile-list">
          {loading ? (
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
              </div>
            ))
          ) : (
            <div className="table-empty-cell">
              No students added in {getStandardHeading(selectedStandard)} yet
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
