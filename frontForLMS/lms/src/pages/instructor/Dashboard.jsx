import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./instructor.css";
import axios from "axios";
import BASE_URL from "../../config/url";



/* ─────────────────────────────────────────
   ROLE GUARD
───────────────────────────────────────── */
function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="ins-denied">
      <div className="ins-denied__card">
        <div className="ins-denied__icon"></div>
        <h2 className="ins-denied__title">Access Restricted</h2>
        <p className="ins-denied__msg">
          This area is only available to <strong>Instructors</strong>.
          Your current role does not have permission to view this page.
        </p>
        <div className="ins-denied__actions">
          <button className="ins-btn-primary" onClick={() => navigate("/student/dashboard")}>
            Go to Student Dashboard
          </button>
          <button className="ins-btn-ghost" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */

// const curentUser = JSON.parse(localStorage.getItem ('user')) 
const MOCK_INSTRUCTOR =
{
  id: 2,
  firstName: "Sara",
  lastName: "Ahmed",
  email: "sara@lms.com",
  role: "INSTRUCTOR",
  avatarUrl: null,
  createdAt: "2023-06-01T00:00:00",
};

const MOCK_COURSES = [
  {
    id: 1,
    title: "React from Zero to Hero",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=70",
    category: { name: "Web Development" },
    level: "BEGINNER",
    published: true,
    totalLessons: 8,
    enrollments: 1240,
    avgRating: 4.8,
    revenue: 6200,
    completionRate: 72,
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    thumbnailUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=70",
    category: { name: "Web Development" },
    level: "ADVANCED",
    published: true,
    totalLessons: 12,
    enrollments: 580,
    avgRating: 4.6,
    revenue: 2900,
    completionRate: 55,
  },
  {
    id: 3,
    title: "Git & GitHub for Teams",
    thumbnailUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&q=70",
    category: { name: "DevOps" },
    level: "BEGINNER",
    published: false,
    totalLessons: 6,
    enrollments: 0,
    avgRating: null,
    revenue: 0,
    completionRate: 0,
  },
];

const MOCK_STUDENTS = [
  { id: 1, firstName: "Youssef", lastName: "Zienhoum", email: "youssef@mail.com", course: "React from Zero to Hero", progress: 100, grade: 91.5, enrolledAt: "2025-02-01" },
  { id: 2, firstName: "Nour", lastName: "Hassan", email: "nour@mail.com", course: "React from Zero to Hero", progress: 68, grade: null, enrolledAt: "2025-02-10" },
  { id: 3, firstName: "Ahmed", lastName: "Tarek", email: "ahmed@mail.com", course: "Advanced TypeScript Patterns", progress: 45, grade: null, enrolledAt: "2025-03-05" },
  { id: 4, firstName: "Lina", lastName: "Mostafa", email: "lina@mail.com", course: "React from Zero to Hero", progress: 82, grade: null, enrolledAt: "2025-03-12" },
  { id: 5, firstName: "Omar", lastName: "Fathy", email: "omar@mail.com", course: "Advanced TypeScript Patterns", progress: 91, grade: 88, enrolledAt: "2025-01-20" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "enrollment", text: "Nour Hassan enrolled in React from Zero to Hero", time: "2h ago" },
  { id: 2, type: "review", text: "New 5 review on React from Zero to Hero", time: "5h ago" },
  { id: 3, type: "question", text: "Ahmed Tarek asked a question in TypeScript Patterns", time: "1d ago" },
  { id: 4, type: "completion", text: "Youssef Zienhoum completed React from Zero to Hero", time: "2d ago" },
  { id: 5, type: "enrollment", text: "Omar Fathy enrolled in Advanced TypeScript Patterns", time: "3d ago" },
];

const ACTIVITY_ICON = {
  enrollment: "",
  review: "",
  question: "",
  completion: "",
};

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function getInitials(u) {
  return `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase();
}

function formatK(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
}

const LEVEL_STYLE = {
  BEGINNER: { color: "#15803d", bg: "#dcfce7" },
  INTERMEDIATE: { color: "#92400e", bg: "#fef3c7" },
  ADVANCED: { color: "#991b1b", bg: "#fee2e2" },
};

/* ─────────────────────────────────────────
   COURSE CARD
───────────────────────────────────────── */
function CourseCard({ course, navigate }) {
  const lvl = LEVEL_STYLE[course.level] || LEVEL_STYLE.BEGINNER;




  return (
    <div className="ins-course-card">
      <div className="ins-course-card__thumb">
        <img src={course.thumbnailUrl} alt={course.title} loading="lazy" />
        <span
          className={`ins-course-card__status ${course.published ? "ins-status--live" : "ins-status--draft"}`}
        >
          {course.published ? "● Live" : "○ Draft"}
        </span>
      </div>

      <div className="ins-course-card__body">
        <div className="ins-course-card__top">
          <span className="ins-course-card__cat">
            {typeof course.category === "object"
              ? course.category.name
              : course.category}</span>
          {/* <span
            className="ins-course-card__level"
            style={{ background: lvl.bg, color: lvl.color }}
          >
            {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
          </span> */}
        </div>

        <h3 className="ins-course-card__title">{course.title}</h3>

        <div className="ins-course-card__stats">
          <div className="ins-mini-stat">
            <span className="ins-mini-stat__val">{formatK(course.enrollments)}</span>
            <span className="ins-mini-stat__label">Students</span>
          </div>
          <div className="ins-mini-stat">
            <span className="ins-mini-stat__val">{course.completionRate}%</span>
            <span className="ins-mini-stat__label">Completion</span>
          </div>
          <div className="ins-mini-stat">
            <span className="ins-mini-stat__val">
              {course.avgRating ? `${course.avgRating}` : "—"}
            </span>
            <span className="ins-mini-stat__label">Rating</span>
          </div>
        </div>

        {/* Completion bar */}
        <div className="ins-comp-bar">
          <div
            className="ins-comp-bar__fill"
            style={{ width: `${course.completionRate}%` }}
          />
        </div>

        <div className="ins-course-card__actions">
          <button
            className="ins-btn-card-primary"
            onClick={() => navigate(`/instructor/edit?course=${course.id}`)}
          >
            Edit Course
          </button>
          <button
            className="ins-btn-card-ghost"
            onClick={() => navigate(`/instructor/analytics?course=${course.id}`)}
          >
            Analytics
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   STUDENTS TABLE ROW
───────────────────────────────────────── */
function StudentRow({ student }) {
  const progressColor =
    student.progress >= 80 ? "#15803d" :
      student.progress >= 50 ? "#92400e" : "#991b1b";

  return (
    <tr className="ins-student-row">
      <td>
        <div className="ins-student-info">
          <div className="ins-student-avatar">
            {getInitials(student)}
          </div>
          <div>
            <p className="ins-student-name">{student.firstName} {student.lastName}</p>
            <p className="ins-student-email">{student.email}</p>
          </div>
        </div>
      </td>
      <td>
        <span className="ins-student-course">{student.course}</span>
      </td>
      <td>
        <div className="ins-prog-cell">
          <div className="ins-prog-bar">
            <div
              className="ins-prog-bar__fill"
              style={{ width: `${student.progress}%`, background: progressColor }}
            />
          </div>
          <span className="ins-prog-pct" style={{ color: progressColor }}>
            {student.progress}%
          </span>
        </div>
      </td>
      <td>
        {student.grade !== null
          ? <span className="ins-grade-badge">{student.grade}%</span>
          : <span className="ins-grade-pending">Pending</span>
        }
      </td>
      <td className="ins-enrolled-date">
        {new Date(student.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────── */
export default function Dashboard() {
  const [courses, setCourses] = useState([])

  const navigate = useNavigate();

  /* ── ROLE GUARD ── */
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const role = currentUser?.role?.toUpperCase();
  const token = localStorage.getItem("token");
  const instructorId = currentUser?.id;
  if (!currentUser || role !== "INSTRUCTOR") {
    return <AccessDenied />; /// عايز اعمله في فولدر لوحده 
  }

  /* Use real user name from localStorage if available, else mock */
  const user = {
    // ...MOCK_INSTRUCTOR,ظ
    firstName: currentUser.firstname,
    lastName: currentUser.lastname,
    email: currentUser.email
  };

  const totalStudents = MOCK_STUDENTS.length;
  const totalRevenue = courses.reduce((s, c) => s + c.revenue, 0);
  const totalCourses = courses.length;
  const publishedCount = courses.filter((c) => c.published).length;
  const avgRating = (
    courses.filter((c) => c.avgRating).reduce((s, c) => s + c.avgRating, 0) /
    courses.filter((c) => c.avgRating).length
  ).toFixed(1);

  const [studentSearch, setStudentSearch] = useState("");

  const filteredStudents = MOCK_STUDENTS.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.email} ${s.course}`
      .toLowerCase()
      .includes(studentSearch.toLowerCase())
  );




  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/courses/my-courses/${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(
        (Array.isArray(res.data) ? res.data : []).map((c) => ({
          ...c,
          published: !!c.published,
          free: !!c.free,
        }))
      );
    } catch (err) {
      console.error(err);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses()
 },[token, instructorId])

  return (
    <div className="ins-page">
      {/* ════════════════════════════════
          HERO HEADER
      ════════════════════════════════ */}
      <div className="ins-hero">
        <div className="ins-hero__left">
          <div className="ins-hero__avatar-wrap">
            <div className="ins-hero__avatar">{getInitials(user)}</div>
            <span className="ins-hero__status" />
          </div>
          <div>
            <p className="ins-hero__greeting">Welcome back,</p>
            <h1 className="ins-hero__name">{user.firstName} {user.lastName}</h1>
            <p className="ins-hero__email">{user.email}</p>
          </div>
        </div>

        {/* KPIs */}
        {/* <div className="ins-hero__kpis">
          <div className="ins-kpi">
            <span className="ins-kpi__val">{totalStudents}</span>
            <span className="ins-kpi__label">Students</span>
          </div>
          <div className="ins-kpi">
            <span className="ins-kpi__val">{totalCourses}</span>
            <span className="ins-kpi__label">Courses</span>
          </div>
          <div className="ins-kpi">
            <span className="ins-kpi__val"> {avgRating}</span>
            <span className="ins-kpi__label">Avg Rating</span>
          </div>
          <div className="ins-kpi">
            <span className="ins-kpi__val">${formatK(totalRevenue)}</span>
            <span className="ins-kpi__label">Revenue</span>
          </div>
        </div> */}
      </div>

      {/* ////////////////////////////////////////////////////// */}
      <div className="ins-body">

        {/* ── Left column ── */}
        <div className="ins-col ins-col--main">

          {/* //////////////////////////// */}
          <section className="ins-section">
            <div className="ins-section__header">
              <div>
                <h2 className="ins-section__title">My Courses</h2>
                <p className="ins-section__sub">
                  {publishedCount} published · {totalCourses - publishedCount} draft
                </p>
              </div>

              <button
                className="ins-btn-primary"
                onClick={() => navigate("/instructor/create")}
              >
                + Add New Course
              </button>
            </div>

            <div className="ins-courses-grid">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} navigate={navigate} />
              ))}

              <button
                className="ins-add-course-card"
                onClick={() => navigate("/instructor/create")}
              >
                <span className="ins-add-course-card__plus">＋</span>
                <span className="ins-add-course-card__label">Create New Course</span>
              </button>
            </div>

            <div className="ins-section__footer">
              <button
                className="ins-btn-ghost"
                onClick={() => navigate("/instructor/create")}
              >
                Manage All Courses →
              </button>
            </div>
          </section>


          <section className="ins-section">
            <div className="ins-section__header">
              <div>
                <h2 className="ins-section__title">Enrolled Students</h2>
                <p className="ins-section__sub"> students across all courses</p>
              </div>
              {/* ── NAVIGATE BUTTON ── */}
              <button
                className="ins-btn-primary"
                onClick={() => navigate("/instructor/students")}
              >
                View All Students
              </button>
            </div>

   

            <div className="ins-section__footer">
              <button
                className="ins-btn-ghost"
                onClick={() => navigate("/instructor/students")}
              >
                Full Student List →
              </button>
            </div>
          </section>

        </div>

        {/* ── Right sidebar ── */}
        <aside className="ins-col ins-col--side">

          {/* Quick actions */}
          <div className="ins-sidebar-card">
            <h3 className="ins-sidebar-card__title">Quick Actions</h3>
            <div className="ins-quick-actions">
              <button
                className="ins-quick-btn"
                onClick={() => navigate("/instructor/create")}
              >
                <span className="ins-quick-btn__icon">＋</span>
                <span>New Course</span>
              </button>
              <button
                className="ins-quick-btn"
                onClick={() => navigate("/instructor/curriculum")}
              >
                <span className="ins-quick-btn__icon">📚</span>
                <span>Curriculum</span>
              </button>
              <button
                className="ins-quick-btn"
                onClick={() => navigate("/instructor/students")}
              >
                <span className="ins-quick-btn__icon">👥</span>
                <span>Students</span>
              </button>
              <button
                className="ins-quick-btn"
                onClick={() => navigate("/instructor/edit")}
              >
                <span className="ins-quick-btn__icon">📊</span>
                <span>edit courses </span>
              </button>

            </div>
          </div>



        </aside>
      </div>
    </div>
  );
}