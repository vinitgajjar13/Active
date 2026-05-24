import { useEffect, useMemo, useRef, useState } from "react";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../context/AuthContext";
import {
  getStudents,
  getStudentOverview,
  getStudentById,
  addStudent,
  editStudent,
  deleteStudent,
  deleteBulkStudents,
  moveBulkStudents,
  previewImportStudents,
  importStudents,
  exportStudentsRequest
} from "../lib/api";
import { getStandardHeading, STANDARD_OPTIONS } from "../data/standards";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Upload01Icon,
  Download01Icon,
  Delete01Icon,
  PencilEdit01Icon,
  EyeIcon,
  Add01Icon,
  Search01Icon,
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  UserAdd01Icon,
  Sorting01Icon
} from "@hugeicons/core-free-icons";

export default function BulkUploadPage() {
  const { token } = useAuth();
  const fileInputRef = useRef(null);

  // Tabs: 'roster' (CRUD list) or 'import' (excel/csv/pdf upload & preview)
  const [activeTab, setActiveTab] = useState("roster");

  // Roster Tab States
  const [students, setStudents] = useState([]);
  const [standardCounts, setStandardCounts] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStandard, setFilterStandard] = useState("");
  const [filterShift, setFilterShift] = useState("Morning");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("rollNumber");
  const [sortOrder, setSortOrder] = useState("asc");

  // Selection state
  const [selectedIds, setSelectedIds] = useState(new Set());

  // CRUD & Interactive Modals
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null); // single delete object
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkMoving, setIsBulkMoving] = useState(false);
  const [targetMoveStandard, setTargetMoveStandard] = useState("LKG");

  // Manual Add/Edit Form State
  const [form, setForm] = useState({
    studentName: "",
    rollNumber: "",
    standard: "LKG",
    shift: "Morning",
    parentName: "",
    parentMobile: ""
  });

  // Action busy states
  const [busy, setBusy] = useState(false);
  const [rosterError, setRosterError] = useState("");
  const [rosterSuccess, setRosterSuccess] = useState("");

  // Import Tab States
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const [previewRows, setPreviewRows] = useState([]); // parsed records being edited
  const [previewSummary, setPreviewSummary] = useState(null); // preview stats
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [importSummaryModal, setImportSummaryModal] = useState(null);

  // Load roster data
  async function loadRoster() {
    setLoading(true);
    setRosterError("");
    try {
      const response = await getStudents(token, {
        page,
        limit: 15,
        search,
        standard: filterStandard,
        shift: filterShift,
        sortBy,
        sortOrder
      });
      setStudents(response.data.items || []);
      setTotalPages(response.data.pagination.totalPages || 1);
      setTotalStudents(response.data.pagination.total || 0);
    } catch (err) {
      setRosterError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  // Load overview counts
  async function loadOverview() {
    try {
      const response = await getStudentOverview(token);
      setStandardCounts(response.data.standards || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (activeTab === "roster") {
      void loadRoster();
      void loadOverview();
    }
  }, [token, page, search, filterStandard, filterShift, sortBy, sortOrder, activeTab]);

  // Handle pagination
  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    }
  };

  // Handle sorting toggle
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Toggle single row checkbox selection
  const handleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const ids = students.map((s) => s._id);
      setSelectedIds(new Set(ids));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Clear selection helper
  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Single Actions
  const handleViewStudent = async (student) => {
    setRosterError("");
    try {
      const response = await getStudentById(token, student._id);
      setViewingStudent(response.data);
    } catch (err) {
      setRosterError(err.message || "Failed to fetch student details");
    }
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setForm({
      studentName: student.studentName || "",
      rollNumber: student.rollNumber || "",
      standard: student.standard || "LKG",
      shift: student.shift || "Morning",
      parentName: student.parentName || "",
      parentMobile: student.parentMobile || student.parentPhoneNumber || ""
    });
    setRosterError("");
    setRosterSuccess("");
  };

  const handleOpenAdd = () => {
    setIsAddingStudent(true);
    setForm({
      studentName: "",
      rollNumber: "",
      standard: filterStandard || "LKG",
      shift: filterShift || "Morning",
      parentName: "",
      parentMobile: ""
    });
    setRosterError("");
    setRosterSuccess("");
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    setBusy(true);
    setRosterError("");
    setRosterSuccess("");
    try {
      if (editingStudent) {
        // Edit student
        const response = await editStudent(token, editingStudent._id, form);
        setRosterSuccess(response.message || "Student details updated successfully");
        setEditingStudent(null);
      } else {
        // Add student
        const response = await addStudent(token, form);
        setRosterSuccess(response.message || "Student added successfully");
        setIsAddingStudent(false);
      }
      void loadRoster();
      void loadOverview();
    } catch (err) {
      setRosterError(err.message || "Operation failed");
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setBusy(true);
    setRosterError("");
    setRosterSuccess("");
    try {
      await deleteStudent(token, deletingStudent._id);
      setRosterSuccess("Student record deleted successfully");
      setDeletingStudent(null);
      void loadRoster();
      void loadOverview();
    } catch (err) {
      setRosterError(err.message || "Failed to delete student");
    } finally {
      setBusy(false);
    }
  };

  // Bulk Actions
  const handleBulkDelete = async () => {
    setBusy(true);
    setRosterError("");
    setRosterSuccess("");
    try {
      const ids = Array.from(selectedIds);
      const response = await deleteBulkStudents(token, ids);
      setRosterSuccess(response.message || "Selected records deleted successfully");
      setIsBulkDeleting(false);
      clearSelection();
      void loadRoster();
      void loadOverview();
    } catch (err) {
      setRosterError(err.message || "Bulk deletion failed");
    } finally {
      setBusy(false);
    }
  };

  const handleBulkMove = async () => {
    setBusy(true);
    setRosterError("");
    setRosterSuccess("");
    try {
      const ids = Array.from(selectedIds);
      const response = await moveBulkStudents(token, ids, targetMoveStandard);
      setRosterSuccess(response.message || `Selected students moved to Std ${targetMoveStandard}`);
      setIsBulkMoving(false);
      clearSelection();
      void loadRoster();
      void loadOverview();
    } catch (err) {
      setRosterError(err.message || "Bulk standard modification failed");
    } finally {
      setBusy(false);
    }
  };

  // Export Trigger
  const handleExport = async (format) => {
    setRosterError("");
    try {
      const ids = selectedIds.size > 0 ? Array.from(selectedIds) : undefined;
      const blob = await exportStudentsRequest(token, {
        ids,
        search,
        standard: filterStandard,
        shift: filterShift,
        format
      });

      // Download trigger
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `students_export_${new Date().toISOString().slice(0, 10)}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setRosterError(err.message || "Export generation failed");
    }
  };

  // File Upload Processing
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      void processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    setUploading(true);
    setImportError("");
    setImportSuccess("");
    setPreviewRows([]);
    setPreviewSummary(null);

    const formData = new FormData();
    formData.append("file", file);
    if (filterStandard) {
      formData.append("standard", filterStandard);
    }
    if (filterShift) {
      formData.append("shift", filterShift);
    }

    try {
      const response = await previewImportStudents(token, formData);
      setPreviewRows(response.data.rows || []);
      setPreviewSummary(response.data.summary || null);
    } catch (err) {
      setImportError(err.message || "Failed to parse import file");
    } finally {
      setUploading(false);
    }
  };

  // Interactive Preview Roster edits
  const handleUpdatePreviewField = (id, field, value) => {
    setPreviewRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const updatedRow = { ...row, [field]: value };

        // Re-validate row fields
        const errors = [];
        if (!updatedRow.studentName.trim()) errors.push("Student Name is required");
        if (!updatedRow.rollNumber.trim()) errors.push("Roll Number is required");
        if (!updatedRow.standard.trim()) errors.push("Standard is required");
        if (!updatedRow.parentName.trim()) errors.push("Parent Name is required");

        const phone = String(updatedRow.parentMobile || "").trim();
        if (!phone) {
          errors.push("Parent Mobile Number is required");
        } else if (phone.length < 8) {
          errors.push("Invalid mobile number length");
        }

        updatedRow.errors = errors;
        updatedRow.isValid = errors.length === 0;
        return updatedRow;
      })
    );
  };

  const handleAddPreviewRow = () => {
    const newId = `row-${Date.now()}`;
    const newRow = {
      id: newId,
      studentName: "",
      rollNumber: "",
      standard: filterStandard || "LKG",
      shift: filterShift || "Morning",
      parentName: "",
      parentMobile: "",
      isValid: false,
      isDuplicate: false,
      errors: ["All fields are required"]
    };
    setPreviewRows((prev) => [...prev, newRow]);
  };

  const handleDeletePreviewRow = (id) => {
    setPreviewRows((prev) => prev.filter((row) => row.id !== id));
  };

  // Final submit save from Preview Table
  const handleSavePreviewImport = async () => {
    const invalidCount = previewRows.filter((r) => !r.isValid).length;
    if (invalidCount > 0) {
      setImportError("Please resolve all validation errors in the preview grid before saving.");
      return;
    }

    setUploading(true);
    setImportError("");
    setImportSuccess("");

    try {
      const response = await importStudents(token, {
        standard: filterStandard,
        shift: filterShift,
        students: previewRows
      });
      setImportSuccess(
        `Successfully imported student list into Std ${filterStandard} (${filterShift} Shift)! Added: ${response.data.insertedCount}, Updated: ${response.data.updatedCount}, Skipped Duplicates: ${response.data.duplicateCount}`
      );
      setImportSummaryModal({
        standard: filterStandard,
        shift: filterShift,
        total: response.data.insertedCount + response.data.updatedCount + response.data.duplicateCount,
        imported: response.data.insertedCount + response.data.updatedCount,
        duplicates: response.data.duplicateCount,
        failed: 0
      });
      setPreviewRows([]);
      setPreviewSummary(null);
      void loadRoster();
      void loadOverview();
    } catch (err) {
      setImportError(err.message || "Failed to commit import records");
    } finally {
      setUploading(false);
    }
  };

  // Generate programmatic sample CSV download
  const handleDownloadSample = () => {
    const headers = "Roll Number,Student Name,Parent Name,Parent Mobile Number\n";
    const sampleRows = "1,John Doe,Jane Doe,9876543210\n2,Alice Kid,Bob Kid,9123456789\n3,Alex Smith,Cynthia Smith,9998887776\n";
    const csvContent = headers + sampleRows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "school_import_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate live preview metrics
  const livePreviewSummary = useMemo(() => {
    const total = previewRows.length;
    const failed = previewRows.filter((r) => !r.isValid).length;
    const duplicates = previewRows.filter((r) => r.isDuplicate && r.isValid).length;
    const valid = total - failed - duplicates;
    return { total, failed, duplicates, valid };
  }, [previewRows]);

  return (
    <div className="page-stack">
      {/* Tabs Menu Header */}
      <div className="tabs-bar">
        <button
          className={`tab-item ${activeTab === "roster" ? "is-active" : ""}`}
          onClick={() => setActiveTab("roster")}
        >
          Student Roster & CRUD
        </button>
        <button
          className={`tab-item ${activeTab === "import" ? "is-active" : ""}`}
          onClick={() => setActiveTab("import")}
        >
          Import Center (Excel/CSV/PDF)
        </button>
      </div>

      {activeTab === "roster" ? (
        <>
          <SectionCard title="Standard Occupancy Summary">
            <div className="standard-grid">
              {STANDARD_OPTIONS.map((opt) => {
                const countObj = standardCounts.find((s) => s.standard === opt.value);
                const count = countObj ? countObj.count : 0;
                const morningCount = countObj ? (countObj.morningCount || 0) : 0;
                const afternoonCount = countObj ? (countObj.afternoonCount || 0) : 0;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`standard-card ${filterStandard === opt.value ? "is-active" : ""} ${count > 0 ? "has-students" : ""}`}
                    onClick={() => {
                      setFilterStandard(filterStandard === opt.value ? "" : opt.value);
                      setPage(1);
                    }}
                    style={{
                      height: "auto",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "left"
                    }}
                  >
                    <span className="standard-card__label" style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "8px" }}>
                      {opt.label}
                    </span>
                    <div style={{ width: "100%", fontSize: "0.8rem", color: "var(--text-body)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span>Morning:</span>
                        <strong>{morningCount}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span>Afternoon:</span>
                        <strong>{afternoonCount}</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #deebfb", paddingTop: "4px", marginTop: "4px", fontWeight: "bold", color: "var(--text-strong)" }}>
                        <span>Total:</span>
                        <span>{count}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* Roster Controls */}
          <div className="split-grid">
            <div className="page-stack" style={{ gridColumn: "span 2" }}>
              {rosterSuccess && <div className="inline-note text-success">{rosterSuccess}</div>}
              {rosterError && <div className="alert alert--error">{rosterError}</div>}

              {/* Roster Bulk Actions Bar */}
              {selectedIds.size > 0 && (
                <div className="bulk-bar">
                  <span className="bulk-bar__count">{selectedIds.size} students selected</span>
                  <button className="btn-primary" style={{ background: "var(--red-600)" }} onClick={() => setIsBulkDeleting(true)}>
                    Delete Selected
                  </button>
                  <button className="btn-primary" onClick={() => setIsBulkMoving(true)}>
                    Move to Standard
                  </button>
                  <button className="btn-primary" style={{ background: "var(--green-600)" }} onClick={() => handleExport("xlsx")}>
                    Export Selected (XLSX)
                  </button>
                  <button className="btn-outline-blue" onClick={clearSelection}>
                    Clear Selection
                  </button>
                </div>
              )}

              {/* Main Student List Card */}
              <SectionCard
                title={`Student Roster (${totalStudents} students)`}
                action={
                  <div className="toolbar" style={{ gap: "10px" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <HugeiconsIcon
                        icon={Search01Icon}
                        className="icon icon--sm"
                        style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-body)" }}
                      />
                      <input
                        className="toolbar__search"
                        type="text"
                        placeholder="Search roster..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                        style={{ paddingLeft: "34px", width: "240px" }}
                      />
                    </div>

                    <select
                      className="toolbar__search"
                      value={filterStandard}
                      onChange={(e) => {
                        setFilterStandard(e.target.value);
                        setPage(1);
                      }}
                      style={{ width: "160px" }}
                    >
                      <option value="">All Standards</option>
                      {STANDARD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <select
                      className="toolbar__search"
                      value={filterShift}
                      onChange={(e) => {
                        setFilterShift(e.target.value);
                        setPage(1);
                      }}
                      style={{ width: "135px" }}
                    >
                      <option value="Morning">Morning Shift</option>
                      <option value="Afternoon">Afternoon Shift</option>
                    </select>

                    <button className="btn-primary" onClick={handleOpenAdd}>
                      <HugeiconsIcon icon={Add01Icon} className="icon icon--sm" />
                      Add Student
                    </button>

                    <div className="preview-row-actions">
                      <button className="btn-outline-blue" title="Export Excel" onClick={() => handleExport("xlsx")}>
                        Excel
                      </button>
                      <button className="btn-outline-blue" title="Export CSV" onClick={() => handleExport("csv")}>
                        CSV
                      </button>
                      <button className="btn-outline-blue" title="Export PDF" onClick={() => handleExport("pdf")}>
                        PDF
                      </button>
                    </div>
                  </div>
                }
              >
                {/* Desktop View */}
                <div className="simple-table simple-table--desktop">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: "40px", textAlign: "center" }}>
                          <input
                            type="checkbox"
                            checked={students.length > 0 && students.every((s) => selectedIds.has(s._id))}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th onClick={() => toggleSort("standard")} style={{ cursor: "pointer" }}>
                          Standard <HugeiconsIcon icon={Sorting01Icon} className="icon icon--xs" />
                        </th>
                        <th>Shift</th>
                        <th onClick={() => toggleSort("rollNumber")} style={{ cursor: "pointer" }}>
                          Roll Number <HugeiconsIcon icon={Sorting01Icon} className="icon icon--xs" />
                        </th>
                        <th onClick={() => toggleSort("studentName")} style={{ cursor: "pointer" }}>
                          Student Name <HugeiconsIcon icon={Sorting01Icon} className="icon icon--xs" />
                        </th>
                        <th>Parent Name</th>
                        <th>Parent Mobile</th>
                        <th>Created Date</th>
                        <th style={{ width: "120px", textAlign: "center" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td className="table-empty-cell" colSpan="9">
                            Loading student records...
                          </td>
                        </tr>
                      ) : students.length ? (
                        students.map((student) => (
                          <tr key={student._id}>
                            <td style={{ textAlign: "center" }}>
                              <input
                                type="checkbox"
                                checked={selectedIds.has(student._id)}
                                onChange={() => handleSelectRow(student._id)}
                              />
                            </td>
                            <td>{getStandardHeading(student.standard)}</td>
                            <td>
                              <span
                                style={{
                                  background: student.shift === "Afternoon" ? "#fff3e0" : "#e8f5e9",
                                  color: student.shift === "Afternoon" ? "#e65100" : "#2e7d32",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  fontSize: "0.8rem",
                                  fontWeight: 600
                                }}
                              >
                                {student.shift || "Morning"}
                              </span>
                            </td>
                            <td>{student.rollNumber}</td>
                            <td><strong>{student.studentName}</strong></td>
                            <td>{student.parentName}</td>
                            <td>{student.parentMobile || student.parentPhoneNumber}</td>
                            <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                            <td style={{ textAlign: "center" }}>
                              <div className="preview-row-actions">
                                <button className="btn-icon" title="View details" onClick={() => handleViewStudent(student)}>
                                  <HugeiconsIcon icon={EyeIcon} className="icon icon--sm" style={{ color: "var(--blue-600)" }} />
                                </button>
                                <button className="btn-icon" btn-icon--edit="true" title="Edit Student" onClick={() => handleOpenEdit(student)}>
                                  <HugeiconsIcon icon={PencilEdit01Icon} className="icon icon--sm" />
                                </button>
                                <button className="btn-icon btn-icon--delete" title="Delete Student" onClick={() => setDeletingStudent(student)}>
                                  <HugeiconsIcon icon={Delete01Icon} className="icon icon--sm" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="table-empty-cell" colSpan="9">
                            No students match your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="simple-table--mobile student-mobile-list">
                  {loading ? (
                    <div className="table-empty-cell">Loading student records...</div>
                  ) : students.length ? (
                    students.map((student) => (
                      <div key={student._id} className="student-mobile-card">
                        <div className="student-mobile-card__header">
                          <span className="student-mobile-card__roll">
                            {getStandardHeading(student.standard)} • {student.shift || "Morning"} Shift • Roll #{student.rollNumber}
                          </span>
                          <strong className="student-mobile-card__name">{student.studentName}</strong>
                        </div>
                        <div className="student-mobile-card__details">
                          <div>
                            <span>Parent</span>
                            <strong>{student.parentName}</strong>
                          </div>
                          <div>
                            <span>Mobile</span>
                            <strong>{student.parentMobile || student.parentPhoneNumber}</strong>
                          </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
                          <button className="btn-icon" onClick={() => handleViewStudent(student)}>
                            <HugeiconsIcon icon={EyeIcon} className="icon icon--sm" style={{ color: "var(--blue-600)" }} />
                          </button>
                          <button className="btn-icon btn-icon--edit" onClick={() => handleOpenEdit(student)}>
                            <HugeiconsIcon icon={PencilEdit01Icon} className="icon icon--sm" />
                          </button>
                          <button className="btn-icon btn-icon--delete" onClick={() => setDeletingStudent(student)}>
                            <HugeiconsIcon icon={Delete01Icon} className="icon icon--sm" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="table-empty-cell">No students match your search criteria.</div>
                  )}
                </div>

                {/* Pagination Roster controls */}
                {totalPages > 1 && (
                  <div className="pagination-bar">
                    <span className="pagination-info">
                      Showing page {page} of {totalPages} ({totalStudents} records total)
                    </span>
                    <div className="pagination-buttons">
                      <button
                        className="pagination-btn"
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                      >
                        Prev
                      </button>
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const p = idx + 1;
                        return (
                          <button
                            key={p}
                            className={`pagination-btn ${page === p ? "is-active" : ""}`}
                            onClick={() => handlePageChange(p)}
                          >
                            {p}
                          </button>
                        );
                      })}
                      <button
                        className="pagination-btn"
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </SectionCard>
            </div>
          </div>
        </>
      ) : (
        /* Import Tab Panel */
        <div className="page-stack">
          <div className="split-grid">
            {/* Left Card: File Uploader */}
            <SectionCard title="Upload Excel, CSV, or PDF Roster">
              <div className="form-stack">
                <div className="split-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <label className="field">
                    <span>Select Target Standard *</span>
                    <select
                      value={filterStandard}
                      onChange={(e) => {
                        setFilterStandard(e.target.value);
                        setPage(1);
                      }}
                      style={{ padding: "10px", borderRadius: "10px", border: "1px solid #deebfb", background: "#ffffff", width: "100%" }}
                    >
                      <option value="">-- Choose Standard --</option>
                      {STANDARD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Select Shift *</span>
                    <select
                      value={filterShift}
                      onChange={(e) => {
                        setFilterShift(e.target.value);
                        setPage(1);
                      }}
                      style={{ padding: "10px", borderRadius: "10px", border: "1px solid #deebfb", background: "#ffffff", width: "100%" }}
                    >
                      <option value="Morning">Morning Shift</option>
                      <option value="Afternoon">Afternoon Shift</option>
                    </select>
                  </label>
                </div>

                {(!filterStandard || !filterShift) && (
                  <div className="alert alert--error" style={{ marginBottom: "16px" }}>
                    Please select both standard and shift before importing.
                  </div>
                )}

                <p style={{ color: "var(--text-body)", fontSize: "0.95rem" }}>
                  Upload a sheet (.xlsx, .xls, .csv) or text PDF. The system will extract roll no, name, parent name, and mobile number and automatically assign them to the selected standard.
                </p>

                {/* Drag and Drop zone */}
                <div
                  className={`drag-drop-zone ${dragActive ? "is-dragging" : ""} ${(!filterStandard || !filterShift) ? "is-disabled" : ""}`}
                  onDragEnter={(filterStandard && filterShift) ? handleDrag : undefined}
                  onDragOver={(filterStandard && filterShift) ? handleDrag : undefined}
                  onDragLeave={(filterStandard && filterShift) ? handleDrag : undefined}
                  onDrop={(filterStandard && filterShift) ? handleDrop : undefined}
                  onClick={() => {
                    if (!filterStandard || !filterShift) return;
                    fileInputRef.current?.click();
                  }}
                  style={{
                    opacity: (!filterStandard || !filterShift) ? 0.6 : 1,
                    cursor: (!filterStandard || !filterShift) ? "not-allowed" : "pointer"
                  }}
                >
                  <HugeiconsIcon icon={Upload01Icon} className="drag-drop-zone__icon" />
                  <div>
                    <strong>Drag and drop student file here</strong>
                    <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-body)", marginTop: "4px" }}>
                      {(filterStandard && filterShift) ? "or click to browse local files" : "Select standard and shift above first"}
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".xlsx,.xls,.csv,.pdf"
                    style={{ display: "none" }}
                    disabled={!filterStandard || !filterShift}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                  <button className="btn-outline-blue" onClick={handleDownloadSample}>
                    <HugeiconsIcon icon={Download01Icon} className="icon icon--sm" />
                    Download Sample Excel/CSV
                  </button>

                  {uploading && <strong style={{ color: "var(--blue-600)" }}>Extracting file data...</strong>}
                </div>

                {importError && <div className="alert alert--error" style={{ marginTop: "16px" }}>{importError}</div>}
                {importSuccess && <div className="alert badge--success" style={{ marginTop: "16px", padding: "12px", border: "1px solid #34b17d" }}>{importSuccess}</div>}
              </div>
            </SectionCard>

            {/* Right Card: Summary / Instruction Panel */}
            <SectionCard title="Import Status Summary">
              {previewRows.length > 0 ? (
                <div className="detail-list">
                  <div className="detail-list__item">
                    <span>Total Rows Extracted</span>
                    <strong>{livePreviewSummary.total}</strong>
                  </div>
                  <div className="detail-list__item">
                    <span>Validation Successful</span>
                    <strong className="text-success">{livePreviewSummary.valid}</strong>
                  </div>
                  <div className="detail-list__item">
                    <span>Failed Rows (Fix required)</span>
                    <strong className="text-danger">{livePreviewSummary.failed}</strong>
                  </div>
                  <div className="detail-list__item">
                    <span>Duplicate Rows (Auto-skipped)</span>
                    <strong style={{ color: "#d97706" }}>{livePreviewSummary.duplicates}</strong>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <button className="btn-primary" style={{ width: "100%" }} onClick={handleSavePreviewImport} disabled={livePreviewSummary.failed > 0}>
                      {livePreviewSummary.failed > 0 ? "Fix errors to import" : "Import Students Into Selected Standard"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="detail-list">
                  <div className="inline-note">
                    Upload an import file to see the validation results. Records will be validated instantly before final commit.
                  </div>
                  <div className="detail-list__item">
                    <span>Requirements</span>
                    <strong>Excel, CSV, PDF</strong>
                  </div>
                  <div className="detail-list__item">
                    <span>Required Columns</span>
                    <strong>Roll No, Student Name, Parent Name, Mobile</strong>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Interactive Import Grid */}
          {previewRows.length > 0 && (
            <SectionCard
              title="Verify and Edit Student Data Before Importing"
              action={
                <button className="btn-primary" onClick={handleAddPreviewRow}>
                  <HugeiconsIcon icon={UserAdd01Icon} className="icon icon--sm" />
                  Insert Missing Student Row
                </button>
              }
            >
              <div className="simple-table">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: "120px" }}>Standard *</th>
                      <th style={{ width: "90px" }}>Roll No *</th>
                      <th>Student Name *</th>
                      <th>Parent Name *</th>
                      <th>Parent Mobile *</th>
                      <th style={{ width: "200px" }}>Validation Status</th>
                      <th style={{ width: "60px", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row) => (
                      <tr key={row.id} style={{ background: !row.isValid ? "#fff2f0" : row.isDuplicate ? "#fffbeb" : "inherit" }}>
                        <td style={{ fontWeight: 600, color: "var(--text-strong)" }}>
                          {getStandardHeading(filterStandard || row.standard)}
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.rollNumber}
                            onChange={(e) => handleUpdatePreviewField(row.id, "rollNumber", e.target.value)}
                            style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.studentName}
                            onChange={(e) => handleUpdatePreviewField(row.id, "studentName", e.target.value)}
                            style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.parentName}
                            onChange={(e) => handleUpdatePreviewField(row.id, "parentName", e.target.value)}
                            style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.parentMobile}
                            onChange={(e) => handleUpdatePreviewField(row.id, "parentMobile", e.target.value)}
                            style={{ width: "100%", padding: "6px", border: "1px solid #cbd5e1", borderRadius: "6px" }}
                          />
                        </td>
                        <td>
                          {row.isValid ? (
                            row.isDuplicate ? (
                              <span className="badge badge--warning">Duplicate Roll No (Skip)</span>
                            ) : (
                              <span className="badge badge--success">Valid</span>
                            )
                          ) : (
                            <span className="badge badge--danger" title={row.errors.join(", ")}>
                              {row.errors[0]}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button className="btn-icon btn-icon--delete" onClick={() => handleDeletePreviewRow(row.id)}>
                            <HugeiconsIcon icon={Delete01Icon} className="icon icon--sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {/* CRUD MODAL: View Student details */}
      {viewingStudent && (
        <div className="modal-backdrop" onClick={() => setViewingStudent(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>View Student Details</h3>
              <button className="modal-close-btn" onClick={() => setViewingStudent(null)}>
                <HugeiconsIcon icon={CancelCircleIcon} className="icon icon--sm" />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-list">
                <div className="detail-list__item">
                  <span>Student Name</span>
                  <strong>{viewingStudent.studentName}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Roll Number</span>
                  <strong>{viewingStudent.rollNumber}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Standard</span>
                  <strong>{getStandardHeading(viewingStudent.standard)}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Shift</span>
                  <strong>{viewingStudent.shift || "Morning"} Shift</strong>
                </div>
                <div className="detail-list__item">
                  <span>Parent Name</span>
                  <strong>{viewingStudent.parentName}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Parent Mobile</span>
                  <strong>{viewingStudent.parentMobile || viewingStudent.parentPhoneNumber}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Source</span>
                  <strong>{viewingStudent.importSource || "Upload"}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Created Date</span>
                  <strong>{new Date(viewingStudent.createdAt).toLocaleString()}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Updated Date</span>
                  <strong>{new Date(viewingStudent.updatedAt).toLocaleString()}</strong>
                </div>

                {/* Attendance Rate Display */}
                {viewingStudent.attendanceStatus && (
                  <div style={{ marginTop: "16px", borderTop: "1px solid #deebfb", paddingTop: "16px" }}>
                    <span style={{ display: "block", fontSize: "0.85rem", color: "var(--text-body)", marginBottom: "8px" }}>
                      Attendance History Overview
                    </span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <strong>{viewingStudent.attendanceStatus.percentage}% Attendance Rate</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-body)" }}>
                        {viewingStudent.attendanceStatus.presentCount} present / {viewingStudent.attendanceStatus.totalSessions} total days
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ height: "10px", width: "100%", background: "#f1f5f9", borderRadius: "5px", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${viewingStudent.attendanceStatus.percentage}%`,
                          background: viewingStudent.attendanceStatus.percentage >= 75 ? "var(--green-600)" : "var(--red-600)",
                          borderRadius: "5px"
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-outline-blue" onClick={() => setViewingStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRUD MODAL: Add / Edit Student details */}
      {(isAddingStudent || editingStudent) && (
        <div className="modal-backdrop" onClick={() => { setIsAddingStudent(false); setEditingStudent(null); }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveStudent}>
              <div className="modal-header">
                <h3>{editingStudent ? "Edit Student Details" : "Add New Student"}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => { setIsAddingStudent(false); setEditingStudent(null); }}
                >
                  <HugeiconsIcon icon={CancelCircleIcon} className="icon icon--sm" />
                </button>
              </div>
              <div className="modal-body form-stack">
                <label className="field">
                  <span>Student Name *</span>
                  <input
                    type="text"
                    required
                    value={form.studentName}
                    onChange={(e) => setForm((c) => ({ ...c, studentName: e.target.value }))}
                  />
                </label>

                <div className="split-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label className="field">
                    <span>Roll Number *</span>
                    <input
                      type="text"
                      required
                      value={form.rollNumber}
                      onChange={(e) => setForm((c) => ({ ...c, rollNumber: e.target.value }))}
                    />
                  </label>

                  <label className="field">
                    <span>Standard *</span>
                    <select
                      value={form.standard}
                      onChange={(e) => setForm((c) => ({ ...c, standard: e.target.value }))}
                      style={{ padding: "10px", borderRadius: "10px", border: "1px solid #deebfb", background: "#ffffff" }}
                    >
                      {STANDARD_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="field">
                  <span>Shift *</span>
                  <select
                    value={form.shift || "Morning"}
                    onChange={(e) => setForm((c) => ({ ...c, shift: e.target.value }))}
                    style={{ padding: "10px", borderRadius: "10px", border: "1px solid #deebfb", background: "#ffffff" }}
                  >
                    <option value="Morning">Morning Shift</option>
                    <option value="Afternoon">Afternoon Shift</option>
                  </select>
                </label>

                <label className="field">
                  <span>Parent Name *</span>
                  <input
                    type="text"
                    required
                    value={form.parentName}
                    onChange={(e) => setForm((c) => ({ ...c, parentName: e.target.value }))}
                  />
                </label>

                <label className="field">
                  <span>Parent Mobile Number *</span>
                  <input
                    type="text"
                    required
                    value={form.parentMobile}
                    onChange={(e) => setForm((c) => ({ ...c, parentMobile: e.target.value }))}
                  />
                </label>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-outline-blue"
                  onClick={() => { setIsAddingStudent(false); setEditingStudent(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={busy}>
                  {busy ? "Saving..." : editingStudent ? "Save Student" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD MODAL: Delete Single Confirmation */}
      {deletingStudent && (
        <div className="modal-backdrop" onClick={() => setDeletingStudent(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-danger">Delete Student Record</h3>
              <button className="modal-close-btn" onClick={() => setDeletingStudent(null)}>
                <HugeiconsIcon icon={CancelCircleIcon} className="icon icon--sm" />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the student <strong>{deletingStudent.studentName}</strong> (Roll #{deletingStudent.rollNumber})?</p>
              <p style={{ color: "var(--text-body)", fontSize: "0.85rem", marginTop: "8px" }}>
                This action is irreversible and the student will be removed from all future attendance lists.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-outline-blue" onClick={() => setDeletingStudent(null)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ background: "var(--red-600)" }} onClick={handleDeleteConfirm} disabled={busy}>
                {busy ? "Deleting..." : "Delete Student"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK ACTION MODAL: Bulk Delete Confirmation */}
      {isBulkDeleting && (
        <div className="modal-backdrop" onClick={() => setIsBulkDeleting(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-danger">Bulk Delete Students</h3>
              <button className="modal-close-btn" onClick={() => setIsBulkDeleting(false)}>
                <HugeiconsIcon icon={CancelCircleIcon} className="icon icon--sm" />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete all <strong>{selectedIds.size} selected students</strong>?</p>
              <p style={{ color: "var(--text-body)", fontSize: "0.85rem", marginTop: "8px" }}>
                This action is irreversible. All selected student records will be soft deleted from the rosters.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-outline-blue" onClick={() => setIsBulkDeleting(false)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ background: "var(--red-600)" }} onClick={handleBulkDelete} disabled={busy}>
                {busy ? "Deleting Selected..." : "Delete Selected Students"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK ACTION MODAL: Bulk Move Standard */}
      {isBulkMoving && (
        <div className="modal-backdrop" onClick={() => setIsBulkMoving(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bulk Move Standard</h3>
              <button className="modal-close-btn" onClick={() => setIsBulkMoving(false)}>
                <HugeiconsIcon icon={CancelCircleIcon} className="icon icon--sm" />
              </button>
            </div>
            <div className="modal-body form-stack">
              <p>You have selected <strong>{selectedIds.size} students</strong> to transfer to another standard.</p>
              <label className="field" style={{ marginTop: "12px" }}>
                <span>Select Target Standard</span>
                <select
                  value={targetMoveStandard}
                  onChange={(e) => setTargetMoveStandard(e.target.value)}
                  style={{ padding: "10px", borderRadius: "10px", border: "1px solid #deebfb", background: "#ffffff", width: "100%" }}
                >
                  {STANDARD_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn-outline-blue" onClick={() => setIsBulkMoving(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleBulkMove} disabled={busy}>
                {busy ? "Moving Students..." : `Move Selected Students to Std ${targetMoveStandard}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Summary Modal */}
      {importSummaryModal && (
        <div className="modal-backdrop" onClick={() => setImportSummaryModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-success">Import Complete</h3>
              <button className="modal-close-btn" onClick={() => setImportSummaryModal(null)}>
                <HugeiconsIcon icon={CancelCircleIcon} className="icon icon--sm" />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-list">
                <div className="detail-list__item">
                  <span>Selected Standard</span>
                  <strong>{getStandardHeading(importSummaryModal.standard)}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Selected Shift</span>
                  <strong>{importSummaryModal.shift || "Morning"} Shift</strong>
                </div>
                <div className="detail-list__item">
                  <span>Total Records Processed</span>
                  <strong>{importSummaryModal.total}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Imported/Updated Records</span>
                  <strong className="text-success">{importSummaryModal.imported}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Duplicate Records (Skipped)</span>
                  <strong style={{ color: "#d97706" }}>{importSummaryModal.duplicates}</strong>
                </div>
                <div className="detail-list__item">
                  <span>Failed Records</span>
                  <strong className="text-danger">{importSummaryModal.failed}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setImportSummaryModal(null)}>
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
