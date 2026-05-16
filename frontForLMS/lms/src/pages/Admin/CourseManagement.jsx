import React, { useState, useMemo } from "react";
import "./admin.css";

/* ─────────────────────────────────────────
   MOCK DATA
   GET    /admin/courses?page=&q=&category=&status=
   PATCH  /admin/courses/:id  { published, featured }
   DELETE /admin/courses/:id
───────────────────────────────────────── */
const INIT_COURSES = [
  { id: 1, title: "React from Zero to Hero",         instructor: "Sara Ahmed",   category: "Web Development", level: "BEGINNER",     published: true,  featured: true,  enrollments: 1240, revenue: 6200,  createdAt: "2024-11-10", thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=80&q=60" },
  { id: 2, title: "Spring Boot & Microservices",     instructor: "Karim Hassan", category: "Backend",         level: "ADVANCED",     published: true,  featured: false, enrollments: 870,  revenue: 4350,  createdAt: "2024-10-01", thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=80&q=60" },
  { id: 3, title: "UI/UX Design Fundamentals",       instructor: "Sara Ahmed",   category: "Design",          level: "BEGINNER",     published: true,  featured: true,  enrollments: 3100, revenue: 0,     createdAt: "2024-12-05", thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=80&q=60" },
  { id: 4, title: "Data Structures & Algorithms",    instructor: "Karim Hassan", category: "Computer Science",level: "INTERMEDIATE", published: true,  featured: false, enrollments: 2050, revenue: 6150,  createdAt: "2024-09-15", thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=80&q=60" },
  { id: 5, title: "Machine Learning with Python",    instructor: "Layla Morsi",  category: "Data Science",    level: "ADVANCED",     published: true,  featured: false, enrollments: 1580, revenue: 7900,  createdAt: "2024-08-20", thumbnailUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=80&q=60" },
  { id: 6, title: "Git & GitHub for Teams",          instructor: "Sara Ahmed",   category: "DevOps",          level: "BEGINNER",     published: false, featured: false, enrollments: 0,    revenue: 0,     createdAt: "2025-01-08", thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=80&q=60" },
  { id: 7, title: "Advanced TypeScript Patterns",    instructor: "Sara Ahmed",   category: "Web Development", level: "ADVANCED",     published: true,  featured: false, enrollments: 580,  revenue: 2900,  createdAt: "2024-07-01", thumbnailUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=80&q=60" },
];

const CATEGORIES = ["All", "Web Development", "Backend", "Design", "Data Science", "Computer Science", "DevOps"];
const LEVELS     = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"];
const LEVEL_STYLE = { BEGINNER: { color: "#15803d", bg: "#dcfce7" }, INTERMEDIATE: { color: "#92400e", bg: "#fef3c7" }, ADVANCED: { color: "#991b1b", bg: "#fee2e2" } };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatK(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
}

/* ─────────────────────────────────────────
   COURSE DETAIL DRAWER
───────────────────────────────────────── */
function CourseDrawer({ course, onClose, onUpdate, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const lvl = LEVEL_STYLE[course.level] || LEVEL_STYLE.BEGINNER;

  return (
    <div className="ip-drawer-overlay" onClick={onClose}>
      <div className="ip-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ip-drawer__header">
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: ".07em" }}>Course Details</p>
            <h2 className="ip-drawer__name" style={{ fontSize: 14 }}>{course.title}</h2>
          </div>
          <button className="ip-drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="ip-drawer__body">
          <img src={course.thumbnailUrl} alt={course.title} className="ap-drawer-thumb" />

          {[
            { label: "Instructor",  val: course.instructor },
            { label: "Category",    val: course.category },
            { label: "Level",       val: <span className="ap-level-badge" style={{ background: lvl.bg, color: lvl.color }}>{course.level}</span> },
            { label: "Published",   val: course.published ? "Yes  Live" : "No ○ Draft" },
            { label: "Featured",    val: course.featured  ? "Yes " : "No" },
            { label: "Enrollments", val: course.enrollments.toLocaleString() },
            { label: "Revenue",     val: `$${course.revenue.toLocaleString()}` },
            { label: "Created",     val: formatDate(course.createdAt) },
          ].map((r) => (
            <div key={r.label} className="ip-drawer__row">
              <span className="ip-drawer__label">{r.label}</span>
              <span className="ip-drawer__val">{r.val}</span>
            </div>
          ))}

          {/* Quick toggles */}
          <div className="ap-drawer-toggles">
            <button
              className={`ap-toggle-btn ${course.published ? "ap-toggle-btn--active" : ""}`}
              onClick={() => onUpdate(course.id, { published: !course.published })}
            >
              {course.published ? "Unpublish" : "Publish"}
            </button>
            <button
              className={`ap-toggle-btn ${course.featured ? "ap-toggle-btn--featured" : ""}`}
              onClick={() => onUpdate(course.id, { featured: !course.featured })}
            >
              {course.featured ? " Unfeature" : " Feature"}
            </button>
          </div>
        </div>

        <div className="ip-drawer__footer">
          {!confirmDel ? (
            <button className="ap-btn-delete" onClick={() => setConfirmDel(true)}>🗑 Delete Course</button>
          ) : (
            <div className="ap-inline-confirm">
              <span>Sure?</span>
              <button className="ap-btn-delete" onClick={() => { onDelete(course.id); onClose(); }}>Yes</button>
              <button className="ad-btn-ghost" onClick={() => setConfirmDel(false)}>No</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function CourseManagement() {
  const [courses,    setCourses]    = useState(INIT_COURSES);
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("All");
  const [lvlFilter,  setLvlFilter]  = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected,   setSelected]   = useState(null);
  const [toast,      setToast]      = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const updateCourse = (id, patch) => {
    /* PATCH /admin/courses/:id */
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    showToast("Course updated.");
    if (selected?.id === id) setSelected((p) => ({ ...p, ...patch }));
  };

  const deleteCourse = (id) => {
    /* DELETE /admin/courses/:id */
    setCourses((prev) => prev.filter((c) => c.id !== id));
    showToast("Course deleted.");
  };

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) &&
          !c.instructor.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== "All"    && c.category !== catFilter)            return false;
      if (lvlFilter !== "All"    && c.level    !== lvlFilter)            return false;
      if (statusFilter === "Published" && !c.published)                  return false;
      if (statusFilter === "Draft"     && c.published)                   return false;
      if (statusFilter === "Featured"  && !c.featured)                   return false;
      return true;
    });
  }, [courses, search, catFilter, lvlFilter, statusFilter]);

  const stats = {
    total:     courses.length,
    published: courses.filter((c) => c.published).length,
    featured:  courses.filter((c) => c.featured).length,
    revenue:   courses.reduce((s, c) => s + c.revenue, 0),
  };

  return (
    <div className="ap-page">
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Course Management</h1>
          <p className="pg-header__sub">{stats.total} courses · {stats.published} published · {stats.featured} featured</p>
        </div>
      </div>

      {toast && <div className="ap-toast">{toast}</div>}

      {/* Stats */}
      <div className="ip-stats-strip">
        {[
          { label: "Total",     val: stats.total,                           color: "var(--text-primary)" },
          { label: "Published", val: stats.published,                       color: "#15803d" },
          { label: "Draft",     val: stats.total - stats.published,         color: "#6b6b6b" },
          { label: "Featured",  val: stats.featured,                        color: "#92400e" },
          { label: "Revenue",   val: `$${(stats.revenue/1000).toFixed(1)}k`,color: "#15803d" },
        ].map((s) => (
          <div key={s.label} className="ip-stat-box">
            <span className="ip-stat-box__val" style={{ color: s.color }}>{s.val}</span>
            <span className="ip-stat-box__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="ip-controls">
        <div className="ip-search-wrap">
          <input className="ip-search" placeholder="Search by title or instructor…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="ip-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>
        <select className="ip-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="ip-select" value={lvlFilter} onChange={(e) => setLvlFilter(e.target.value)}>
          {LEVELS.map((l) => <option key={l} value={l}>{l === "All" ? "All Levels" : l.charAt(0) + l.slice(1).toLowerCase()}</option>)}
        </select>
        <select className="ip-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
          <option value="Featured">Featured</option>
        </select>
      </div>

      {/* Table */}
      <div className="ip-table-wrap">
        {filtered.length === 0 ? (
          <div className="pg-empty"><span>📚</span><p>No courses match your filters.</p></div>
        ) : (
          <table className="ip-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Category</th>
                <th>Level</th>
                <th>Students</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const lvl = LEVEL_STYLE[c.level] || LEVEL_STYLE.BEGINNER;
                return (
                  <tr key={c.id} className="ip-table__row" onClick={() => setSelected(c)}>
                    <td>
                      <div className="ap-course-cell">
                        <img src={c.thumbnailUrl} alt={c.title} className="ap-course-thumb" />
                        <div>
                          <p className="ad-user-name">{c.title}</p>
                          {c.featured && <span className="ap-featured-tag"> Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="ad-date-cell">{c.instructor}</td>
                    <td><span className="ad-cat-tag">{c.category}</span></td>
                    <td>
                      <span className="ap-level-badge" style={{ background: lvl.bg, color: lvl.color }}>
                        {c.level.charAt(0) + c.level.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="ad-date-cell">{formatK(c.enrollments)}</td>
                    <td className="ad-date-cell" style={{ color: "#15803d", fontWeight: 700 }}>
                      ${formatK(c.revenue)}
                    </td>
                    <td>
                      <span className={`ad-pub-badge ${c.published ? "ad-pub-badge--live" : "ad-pub-badge--draft"}`}>
                        {c.published ? "● Live" : "○ Draft"}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="ad-row-actions">
                        <button className="ad-action-btn"
                          onClick={() => updateCourse(c.id, { published: !c.published })}>
                          {c.published ? "Unpublish" : "Publish"}
                        </button>
                        <button className="ad-action-btn ad-action-btn--danger"
                          onClick={() => deleteCourse(c.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <CourseDrawer
          course={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateCourse}
          onDelete={deleteCourse}
        />
      )}
    </div>
  );
}