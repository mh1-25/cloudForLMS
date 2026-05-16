import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "./instructor.css";
import BASE_URL from "../../config/url";
/* ─────────────────────────────────────────
   CONFIG — adjust to your auth approach
───────────────────────────────────────── */
// Pull token & instructorId however you store them (context, localStorage, props…)
// Example assumes they live in localStorage; swap as needed.
const token        = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const instructorId = user?.id;


const STATUS_META = {
  ENROLLED:    { label: "Enrolled",    color: "#1d4ed8", bg: "#dbeafe" },
  COMPLETED:   { label: "Completed",   color: "#15803d", bg: "#dcfce7" },
  NOT_STARTED: { label: "Not Started", color: "#6b6b6b", bg: "#f5f3ef" },
};

function getStatusMeta(status = "") {
  return STATUS_META[status.toUpperCase()] ?? { label: status, color: "#6b6b6b", bg: "#f5f3ef" };
}

function getInitials(s) {
  const first = s.firstName?.[0] ?? "";
  const last  = s.lastName?.[0]  ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

/* ─────────────────────────────────────────
   STUDENT DETAIL DRAWER
───────────────────────────────────────── */
function StudentDrawer({ student, onClose }) {
  if (!student) return null;
  const sm = getStatusMeta(student.status);

  return (
    <div className="ip-drawer-overlay" onClick={onClose}>
      <div className="ip-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ip-drawer__header">
          <div className="ip-drawer__avatar">{getInitials(student)}</div>
          <div>
            <h2 className="ip-drawer__name">
              {student.firstName} {student.lastName}
            </h2>
            <p className="ip-drawer__email">{student.email}</p>
          </div>
          <button className="ip-drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="ip-drawer__body">
          <div className="ip-drawer__row">
            <span className="ip-drawer__label">Course</span>
            <span className="ip-drawer__val">{student.courseTitle}</span>
          </div>
          <div className="ip-drawer__row">
            <span className="ip-drawer__label">Status</span>
            <span
              className="ip-status-badge"
              style={{ background: sm.bg, color: sm.color }}
            >
              {sm.label}
            </span>
          </div>
          <div className="ip-drawer__row">
            <span className="ip-drawer__label">Enrolled</span>
            <span className="ip-drawer__val">{formatDate(student.enrolledAt)}</span>
          </div>
        </div>

        <div className="ip-drawer__footer">
          <a href={`mailto:${student.email}`} className="ins-btn-primary">
            ✉ Send Email
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function StudentList() {
  const [courses,       setCourses]       = useState([]);
  const [students,      setStudents]      = useState([]);   
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error,         setError]         = useState(null);

  const [search,       setSearch]       = useState("");
  const [courseFilter, setCourseFilter] = useState("All Courses");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy,       setSortBy]       = useState("enrolledAt");
  const [selected,     setSelected]     = useState(null);

  /* ── 1. Fetch instructor courses ── */
  const fetchCourses = async () => {
    setLoadingCourses(true);
    setError(null);
    try {
      const res = await axios.get(
        `${BASE_URL}api/courses/my-courses/${instructorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const list = (Array.isArray(res.data) ? res.data : []).map((c) => ({
        ...c,
        published: !!c.published,
        free:      !!c.free,
      }));
      setCourses(list);
      return list;
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Failed to load courses.");
      setCourses([]);
      return [];
    } finally {
      setLoadingCourses(false);
    }
  };

  /* ── 2. For every course, fetch enrolled students ── */
  const fetchAllStudents = async (courseList) => {
    if (!courseList.length) return;
    setLoadingStudents(true);
    try {
      const results = await Promise.all(
        courseList.map((course) =>
          axios
            .get(
              `${BASE_URL}api/enrollments/EnrolledStudents/${course.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) =>
              (Array.isArray(res.data) ? res.data : []).map((enrollment) => ({
                // Flatten: merge student info + enrollment info into one object
                id:          enrollment.enrollmentId,
                enrollmentId: enrollment.enrollmentId,
                studentId:   enrollment.student?.studentId,
                firstName:   enrollment.student?.firstName  ?? "",
                lastName:    enrollment.student?.lastName   ?? "",
                email:       enrollment.student?.email      ?? "",
                courseId:    enrollment.courseId,
                courseTitle: enrollment.courseTitle         ?? course.title ?? "",
                status:      enrollment.status              ?? "ENROLLED",
                enrolledAt:  enrollment.enrolledAt          ?? null,
              }))
            )
            .catch(() => [])   // if one course fails, skip it silently
        )
      );
      // Flatten array-of-arrays
      setStudents(results.flat());
    } catch (err) {
      console.error("Failed to load students:", err);
      setError("Failed to load students.");
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchCourses().then(fetchAllStudents);
  }, []);

  /* ── Derived course list for the filter dropdown ── */
  const courseOptions = useMemo(() => {
    const titles = [...new Set(students.map((s) => s.courseTitle))].filter(Boolean);
    return ["All Courses", ...titles];
  }, [students]);

  /* ── Filtered + sorted view ── */
  const filtered = useMemo(() => {
    return students
      .filter((s) => {
        const q = search.toLowerCase();
        if (q && !`${s.firstName} ${s.lastName} ${s.email}`.toLowerCase().includes(q))
          return false;
        if (courseFilter !== "All Courses" && s.courseTitle !== courseFilter)
          return false;
        if (statusFilter !== "All" && s.status.toUpperCase() !== statusFilter.toUpperCase())
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name")       return a.firstName.localeCompare(b.firstName);
        if (sortBy === "enrolledAt") return new Date(b.enrolledAt) - new Date(a.enrolledAt);
        return 0;
      });
  }, [students, search, courseFilter, statusFilter, sortBy]);

  /* ── Stats ── */
  const stats = useMemo(() => ({
    total:    students.length,
    enrolled: students.filter((s) => s.status.toUpperCase() === "ENROLLED").length,
    completed: students.filter((s) => s.status.toUpperCase() === "COMPLETED").length,
  }), [students]);

  /* ── Loading / error states ── */
  const isLoading = loadingCourses || loadingStudents;

  /* ── Export CSV ── */
  const exportCSV = () => {
    const csv = ["Name,Email,Course,Status,Enrolled"]
      .concat(
        students.map(
          (s) =>
            `${s.firstName} ${s.lastName},${s.email},${s.courseTitle},${s.status},${s.enrolledAt ?? ""}`
        )
      )
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "students.csv";
    a.click();
  };

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <div className="ins-page">
      {/* Header */}
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Enrolled Students</h1>
          <p className="pg-header__sub">
            {isLoading ? "Loading…" : `${stats.total} students across all courses`}
          </p>
        </div>
        <button className="ins-btn-ghost" onClick={exportCSV} disabled={isLoading}>
          ⬇ Export CSV
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{
          background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca",
          borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 14,
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Stats strip */}
      <div className="ip-stats-strip">
        {[
          { label: "Total",     val: stats.total,     color: "var(--text-primary)" },
          { label: "Enrolled",  val: stats.enrolled,  color: "#1d4ed8" },
          { label: "Completed", val: stats.completed, color: "#15803d" },
        ].map((s) => (
          <div key={s.label} className="ip-stat-box">
            <span className="ip-stat-box__val" style={{ color: s.color }}>
              {isLoading ? "…" : s.val}
            </span>
            <span className="ip-stat-box__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="ip-controls">
        <div className="ip-search-wrap">
          <input
            className="ip-search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="ip-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        <select
          className="ip-select"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          {courseOptions.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select
          className="ip-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="ENROLLED">Enrolled</option>
          <option value="COMPLETED">Completed</option>
          <option value="NOT_STARTED">Not Started</option>
        </select>

        <select
          className="ip-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="enrolledAt">Sort: Newest</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      {/* Table */}
      <div className="ip-table-wrap">
        {isLoading ? (
          <div className="pg-empty">
            <span>⏳</span>
            <p>Loading students…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pg-empty">
            <span>👥</span>
            <p>No students match your filters.</p>
          </div>
        ) : (
          <table className="ip-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Status</th>
                <th>Enrolled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const sm = getStatusMeta(s.status);
                return (
                  <tr
                    key={s.id}
                    className="ip-table__row"
                    onClick={() => setSelected(s)}
                  >
                    {/* Student */}
                    <td>
                      <div className="ip-student-info">
                        <div className="ip-student-avatar">{getInitials(s)}</div>
                        <div>
                          <p className="ip-student-name">
                            {s.firstName} {s.lastName}
                          </p>
                          <p className="ip-student-email">{s.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td>
                      <span className="ip-course-tag">{s.courseTitle}</span>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className="ip-status-badge"
                        style={{ background: sm.bg, color: sm.color }}
                      >
                        {sm.label}
                      </span>
                    </td>

                    {/* Enrolled date */}
                    <td className="ip-date-cell">{formatDate(s.enrolledAt)}</td>

                    {/* View btn */}
                    <td><span className="ip-view-btn">View →</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <StudentDrawer student={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}