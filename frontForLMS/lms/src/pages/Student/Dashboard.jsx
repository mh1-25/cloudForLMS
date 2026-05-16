import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../config/url";
/* ── User from localStorage ── */
const user = JSON.parse(localStorage.getItem("user") || "null");
const token = localStorage.getItem("token");

/* ── Helpers ── */
const LEVEL_COLOR = {
  BEGINNER: { bg: "#dcfce7", color: "#15803d" },
  INTERMEDIATE: { bg: "#fef3c7", color: "#92400e" },
  ADVANCED: { bg: "#fee2e2", color: "#991b1b" },
};

function formatDate(iso) {
  if (!iso) return "—";

  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(user) {
  return `${user?.firstname?.[0] ?? ""}${user?.lastname?.[0] ?? ""}`.toUpperCase();
}


function ProgressCard({ enrollment }) {
  const { course, progressPercentage } = enrollment;

  const lvl =
    LEVEL_COLOR[course.level] || LEVEL_COLOR.BEGINNER;

  const lessonsCompleted = Math.round(
    (progressPercentage / 100) * course.totalLessons
  );

  return (
    <div className="db-course-card">
      <div className="db-course-card__thumb">
        <img
          src={course.thumbnailUrl || "https://via.placeholder.com/300x200"}
          alt={course.title}
        />

        <span
          className="db-course-card__level"
          style={{
            background: lvl.bg,
            color: lvl.color,
          }}
        >
          {course.level?.toLowerCase()}
        </span>
      </div>

      <div className="db-course-card__body">
        <p className="db-course-card__cat">
          {course.category?.name || "General"}
        </p>

        <h3 className="db-course-card__title">
          {course.title}
        </h3>

        {/* <p className="db-course-card__inst">
          {course.instructorName || "Instructor"}
        </p> */}




        <Link
          to={`/student/details/${course.id}`}
          className="db-btn-continue"
        >
          Continue →
        </Link>
      </div>
    </div>
  );
}


function CompletedRow({ enrollment }) {
  const { course, completedAt, certificate } = enrollment;

  const lvl =
    LEVEL_COLOR[course.level] || LEVEL_COLOR.BEGINNER;

  return (
    <div className="db-completed-row">
      <div className="db-completed-row__thumb">
        <img
          src={course.thumbnailUrl || "https://via.placeholder.com/300x200"}
          alt={course.title}
        />

        <span className="db-completed-check">
          ✓
        </span>
      </div>

      <div className="db-completed-row__info">
        <h4 className="db-completed-row__title">
          {course.title}
        </h4>

        <p className="db-completed-row__meta">
          <span
            style={{
              background: lvl.bg,
              color: lvl.color,
              borderRadius: 20,
              padding: "2px 8px",
              fontSize: 10,
            }}
          >
            {course.level}
          </span>

          {/* <span> · {course.instructorName}</span> */}
          <span>
            {" "}
            · Completed {formatDate(completedAt)}
          </span>
        </p>
      </div>

      <div className="db-completed-row__right">
        {certificate && (
          <>
            <span className="db-score-badge">
              {certificate.finalScore}%
            </span>

            <Link
              to="/student/certificate"
              className="db-cert-link"
            >
              View Certificate →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}


export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [tab, setTab] = useState("progress");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const enrollRes = await axios.get(
          `${BASE_URL}api/enrollments/my-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const finalEnrollments = await Promise.all(
          enrollRes.data.map(async (e) => {
            try {
              const progressRes = await axios.get(
                `${BASE_URL}api/quizzes-exams/courses/${e.courseId}/progress`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const p = progressRes.data;

              return {
                id: e.enrollmentId,
                progressPercentage:
                  p?.overallProgressPercentage || 0,

                completed:
                  (p?.overallProgressPercentage || 0) === 100,

                completedAt:
                  (p?.overallProgressPercentage || 0) === 100
                    ? new Date()
                    : null,

                certificate:
                  (p?.overallProgressPercentage || 0) === 100
                    ? {
                        finalScore:
                          p?.averageQuizScore || 0,
                      }
                    : null,

                course: {
                  id: e.courseId,
                  title: e.courseTitle || "Course",
                  thumbnailUrl:
                    e.thumbnailUrl || "",
                  totalLessons:
                    e.totalLessons || 0,
                  level:
                    e.level || "BEGINNER",
                  category: {
                    name:
                      e.categoryName || "General",
                  },
                  instructorName:
                    e.instructor.firstName || "Instructor",
                },
              };
            } catch (error) {
              console.log(
                "Progress fetch error:",
                error
              );

              return {
                id: e.enrollmentId,
                progressPercentage: 0,
                completed: false,
                completedAt: null,
                certificate: null,

                course: {
                  id: e.courseId,
                  title: e.courseTitle || "Course",
                  thumbnailUrl:
                    e.thumbnailUrl || "",
                  totalLessons:
                    e.totalLessons || 0,
                  level:
                    e.level || "BEGINNER",
                  category: {
                    name:
                      e.categoryName || "General",
                  },
                  instructorName:
                    e.instructorName || "Instructor",
                },
              };
            }
          })
        );

        setEnrollments(finalEnrollments);
      } catch (error) {
        console.log("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const completed = enrollments.filter(
    (e) => e.completed
  );

  const inProgress = enrollments.filter(
    (e) => !e.completed
  );

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="db-page">
      {/* Hero */}
      <div className="db-hero">
        <div className="db-avatar-wrap">
          <div className="db-avatar db-avatar--initials">
            {getInitials(user)}
          </div>

          <span className="db-avatar__status" />
        </div>

        <div className="db-hero__info">
          <h1 className="db-hero__name">
            {user?.firstname} {user?.lastname}
          </h1>

          <p className="db-hero__email">
            {user?.email}
          </p>
        </div>

        <div className="db-kpis">
          <div className="db-kpi">
            <span className="db-kpi__val">
              {enrollments.length}
            </span>

            <span className="db-kpi__label">
              Courses
            </span>
          </div>

          <div className="db-kpi">
            <span className="db-kpi__val">
              {completed.length}
            </span>

            <span className="db-kpi__label">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="db-tabs-row">
        <button
          className={`db-tab ${
            tab === "progress"
              ? "db-tab--active"
              : ""
          }`}
          onClick={() => setTab("progress")}
        >
          In Progress

          <span className="db-tab__count">
            {inProgress.length}
          </span>
        </button>

        <button
          className={`db-tab ${
            tab === "completed"
              ? "db-tab--active"
              : ""
          }`}
          onClick={() => setTab("completed")}
        >
          Completed

          <span className="db-tab__count">
            {completed.length}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="db-content">
        {tab === "progress" && (
          <div className="db-cards-grid">
            {inProgress.length > 0 ? (
              inProgress.map((e) => (
                <ProgressCard
                  key={e.id}
                  enrollment={e}
                />
              ))
            ) : (
              <p>No courses in progress</p>
            )}
          </div>
        )}

        {tab === "completed" && (
          <div className="db-completed-list">
            {completed.length > 0 ? (
              completed.map((e) => (
                <CompletedRow
                  key={e.id}
                  enrollment={e}
                />
              ))
            ) : (
              <p>No completed courses yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}