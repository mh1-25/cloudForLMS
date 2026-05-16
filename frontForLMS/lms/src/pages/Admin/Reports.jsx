import React, { useState, useMemo } from "react";
import "./admin.css";

/* ─────────────────────────────────────────
   MOCK DATA
   GET /admin/reports?type=revenue&from=&to=&group=day|week|month
───────────────────────────────────────── */
const MONTHLY_REVENUE = [
  { month: "Sep 24", revenue: 1200, enrollments: 48 },
  { month: "Oct 24", revenue: 2100, enrollments: 84 },
  { month: "Nov 24", revenue: 3400, enrollments: 136 },
  { month: "Dec 24", revenue: 2800, enrollments: 112 },
  { month: "Jan 25", revenue: 4200, enrollments: 168 },
  { month: "Feb 25", revenue: 5100, enrollments: 204 },
  { month: "Mar 25", revenue: 6300, enrollments: 252 },
  { month: "Apr 25", revenue: 5800, enrollments: 232 },
];

const TOP_COURSES = [
  { id: 1, title: "React from Zero to Hero",      instructor: "Sara Ahmed",   enrollments: 1240, revenue: 6200,  completionRate: 72 },
  { id: 5, title: "Machine Learning with Python", instructor: "Layla Morsi",  enrollments: 1580, revenue: 7900,  completionRate: 61 },
  { id: 4, title: "Data Structures & Algorithms", instructor: "Karim Hassan", enrollments: 2050, revenue: 6150,  completionRate: 55 },
  { id: 3, title: "UI/UX Design Fundamentals",    instructor: "Sara Ahmed",   enrollments: 3100, revenue: 0,     completionRate: 48 },
  { id: 2, title: "Spring Boot & Microservices",  instructor: "Karim Hassan", enrollments: 870,  revenue: 4350,  completionRate: 69 },
];

const USER_GROWTH = [
  { month: "Sep 24", students: 120, instructors: 2 },
  { month: "Oct 24", students: 185, instructors: 1 },
  { month: "Nov 24", students: 240, instructors: 2 },
  { month: "Dec 24", students: 198, instructors: 0 },
  { month: "Jan 25", students: 310, instructors: 3 },
  { month: "Feb 25", students: 422, instructors: 2 },
  { month: "Mar 25", students: 518, instructors: 1 },
  { month: "Apr 25", students: 487, instructors: 3 },
];

/* ─────────────────────────────────────────
   BAR CHART (pure CSS + SVG-free)
───────────────────────────────────────── */
function BarChart({ data, valueKey, labelKey, color = "var(--gold)", height = 160 }) {
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div className="ap-bar-chart">
      <div className="ap-bar-chart__bars" style={{ height }}>
        {data.map((d, i) => {
          const pct = max > 0 ? (d[valueKey] / max) * 100 : 0;
          return (
            <div key={i} className="ap-bar-wrap" title={`${d[labelKey]}: ${d[valueKey]}`}>
              <div className="ap-bar" style={{ height: `${pct}%`, background: color }} />
              <span className="ap-bar-label">{d[labelKey]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const REPORT_TYPES = ["Revenue", "Enrollments", "User Growth", "Completion Rates"];
const DATE_RANGES  = ["Last 7 days", "Last 30 days", "Last 3 months", "All time"];

export default function Reports() {
  const [reportType, setReportType] = useState("Revenue");
  const [dateRange,  setDateRange]  = useState("All time");
  const [toast,      setToast]      = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  /* Summary KPIs */
  const totalRevenue     = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const totalEnrollments = MONTHLY_REVENUE.reduce((s, m) => s + m.enrollments, 0);
  const totalStudents    = USER_GROWTH.reduce((s, m) => s + m.students, 0);
  const avgCompletion    = Math.round(TOP_COURSES.reduce((s, c) => s + c.completionRate, 0) / TOP_COURSES.length);

  /* Export CSV */
  const handleExport = () => {
    let rows = [];
    if (reportType === "Revenue") {
      rows = [["Month", "Revenue ($)", "Enrollments"], ...MONTHLY_REVENUE.map((m) => [m.month, m.revenue, m.enrollments])];
    } else if (reportType === "User Growth") {
      rows = [["Month", "New Students", "New Instructors"], ...USER_GROWTH.map((m) => [m.month, m.students, m.instructors])];
    } else {
      rows = [["Course", "Instructor", "Enrollments", "Revenue", "Completion %"],
              ...TOP_COURSES.map((c) => [c.title, c.instructor, c.enrollments, c.revenue, c.completionRate + "%"])];
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `report-${reportType.toLowerCase().replace(/\s/g, "-")}.csv`;
    a.click();
    showToast("Report exported as CSV!");
  };

  return (
    <div className="ap-page">
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Reports & Analytics</h1>
          <p className="pg-header__sub">Platform-wide metrics and performance data</p>
        </div>
        <button className="ad-btn-primary" onClick={handleExport}>⬇ Export CSV</button>
      </div>

      {toast && <div className="ap-toast">{toast}</div>}

      {/* Summary KPIs */}
      <div className="ad-kpi-strip">
        {[
          { icon: "", label: "Total Revenue",    value: `$${(totalRevenue/1000).toFixed(1)}k`, sub: "all time",        color: "#15803d" },
          { icon: "", label: "Total Enrollments", value: totalEnrollments.toLocaleString(),     sub: "all courses",    color: "#1d4ed8" },
          { icon: "", label: "Total Students",    value: totalStudents.toLocaleString(),         sub: "registered",     color: "#7c3aed" },
          { icon: "", label: "Avg Completion",    value: `${avgCompletion}%`,                   sub: "across courses", color: "#92400e" },
        ].map((k) => (
          <div key={k.label} className="ad-kpi-card">
            {/* <div className="ad-kpi-card__icon" style={{ background: k.color + "22", color: k.color }}>{k.icon}</div> */}
            <div className="ad-kpi-card__info">
              <span className="ad-kpi-card__val">{k.value}</span>
              <span className="ad-kpi-card__label">{k.label}</span>
              <span className="ad-kpi-card__sub">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="ip-controls">
        <div className="ip-filter-pills">
          {REPORT_TYPES.map((t) => (
            <button key={t}
              className={`ip-filter-pill ${reportType === t ? "ip-filter-pill--active" : ""}`}
              onClick={() => setReportType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <select className="ip-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          {DATE_RANGES.map((d) => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="ap-reports-body">
        {/* ── Chart panel ── */}
        <div className="ap-report-panel">
          <div className="ap-panel__header">
            <div>
              <h2 className="ap-panel__title">{reportType}</h2>
              <p className="ap-panel__sub">{dateRange}</p>
            </div>
          </div>

          <div style={{ padding: "1.5rem" }}>
            {reportType === "Revenue" && (
              <>
                <BarChart data={MONTHLY_REVENUE} valueKey="revenue" labelKey="month" color="var(--gold)" />
                <div className="ap-chart-table">
                  <table className="ip-table">
                    <thead><tr><th>Month</th><th>Revenue</th><th>Enrollments</th><th>Avg / Enrollment</th></tr></thead>
                    <tbody>
                      {MONTHLY_REVENUE.map((m) => (
                        <tr key={m.month} className="ip-table__row">
                          <td className="ad-date-cell">{m.month}</td>
                          <td style={{ fontWeight: 700, color: "#15803d" }}>${m.revenue.toLocaleString()}</td>
                          <td className="ad-date-cell">{m.enrollments}</td>
                          <td className="ad-date-cell">${(m.revenue / m.enrollments).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {reportType === "Enrollments" && (
              <>
                <BarChart data={MONTHLY_REVENUE} valueKey="enrollments" labelKey="month" color="#1d4ed8" />
                <div className="ap-chart-table">
                  <table className="ip-table">
                    <thead><tr><th>Month</th><th>Enrollments</th><th>Revenue</th></tr></thead>
                    <tbody>
                      {MONTHLY_REVENUE.map((m) => (
                        <tr key={m.month} className="ip-table__row">
                          <td className="ad-date-cell">{m.month}</td>
                          <td style={{ fontWeight: 700, color: "#1d4ed8" }}>{m.enrollments}</td>
                          <td className="ad-date-cell">${m.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {reportType === "User Growth" && (
              <>
                <BarChart data={USER_GROWTH} valueKey="students" labelKey="month" color="#7c3aed" />
                <div className="ap-chart-table">
                  <table className="ip-table">
                    <thead><tr><th>Month</th><th>New Students</th><th>New Instructors</th></tr></thead>
                    <tbody>
                      {USER_GROWTH.map((m) => (
                        <tr key={m.month} className="ip-table__row">
                          <td className="ad-date-cell">{m.month}</td>
                          <td style={{ fontWeight: 700, color: "#7c3aed" }}>{m.students}</td>
                          <td className="ad-date-cell">{m.instructors}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {reportType === "Completion Rates" && (
              <div className="ap-completion-list">
                {TOP_COURSES.sort((a, b) => b.completionRate - a.completionRate).map((c) => {
                  const col = c.completionRate >= 70 ? "#15803d" : c.completionRate >= 50 ? "#92400e" : "#991b1b";
                  return (
                    <div key={c.id} className="ap-completion-row">
                      <div className="ap-completion-row__info">
                        <p className="ap-completion-row__title">{c.title}</p>
                        <p className="ap-completion-row__inst">{c.instructor}</p>
                      </div>
                      <div className="ap-completion-row__bar-wrap">
                        <div className="ap-completion-bar">
                          <div className="ap-completion-bar__fill" style={{ width: `${c.completionRate}%`, background: col }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: col, minWidth: 36 }}>{c.completionRate}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Top courses sidebar ── */}
        <div className="ap-report-sidebar">
          <div className="ap-panel">
            <div className="ap-panel__header">
              <h2 className="ap-panel__title">Top Courses</h2>
              <p className="ap-panel__sub">by enrollments</p>
            </div>
            <div style={{ padding: "0 1rem 1rem" }}>
              {TOP_COURSES.sort((a, b) => b.enrollments - a.enrollments).map((c, i) => (
                <div key={c.id} className="ap-top-course-row">
                  <span className="ap-top-course-row__rank">#{i + 1}</span>
                  <div className="ap-top-course-row__info">
                    <p className="ap-top-course-row__title">{c.title}</p>
                    <p className="ap-top-course-row__meta">{c.enrollments.toLocaleString()} students</p>
                  </div>
                  <span className="ap-top-course-row__revenue" style={{ color: c.revenue > 0 ? "#15803d" : "var(--text-muted)" }}>
                    {c.revenue > 0 ? `$${(c.revenue/1000).toFixed(1)}k` : "Free"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}