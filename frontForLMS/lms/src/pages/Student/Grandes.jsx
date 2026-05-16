import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config/url";
/* ─────────────────────────────────────────
   HELPERS (كما هي)
───────────────────────────────────────── */
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function gradeLabel(pct) {
  if (pct === null || pct === undefined) return { letter: "—", color: "#6b6b6b", bg: "#f5f3ef" };
  if (pct >= 90) return { letter: "A", color: "#15803d", bg: "#dcfce7" };
  if (pct >= 80) return { letter: "B", color: "#1d4ed8", bg: "#dbeafe" };
  if (pct >= 70) return { letter: "C", color: "#92400e", bg: "#fef3c7" };
  if (pct >= 60) return { letter: "D", color: "#b45309", bg: "#ffedd5" };
  return { letter: "F", color: "#991b1b", bg: "#fee2e2" };
}

function pct(score, max = 100) {
  if (score === null || score === undefined) return null;
  return Math.round((score / max) * 100);
}

const TYPE_META = {
  QUIZ: { label: "Quiz", color: "#1d4ed8", bg: "#dbeafe" },
  EXAM: { label: "Exam", color: "#7c3aed", bg: "#ede9fe" },
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Grades() {
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      const enrollRes = await axios.get(
        `${BASE_URL}api/enrollments/my-courses`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const enrolledCourses = enrollRes.data;
      
      const finalCourses = await Promise.all(
        enrolledCourses.map(async (enroll) => {
          const courseId = enroll.courseId;

          const progressRes = await axios.get(
            `${BASE_URL}api/quizzes-exams/courses/${courseId}/progress`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const p = progressRes.data;

          // quizzes
          const quizItems = p.quizScores.map((q) => ({
            id: q.attemptId,
            type: "QUIZ",
            title: q.quizTitle,
            score: q.score,
            maxScore: 100,
            date: null,
            attempts: 1,
            maxAttempts: 1,
          }));

          // exams
          const examItems = p.examAttempts.map((e) => ({
            id: e.attemptId,
            type: "EXAM",
            title: "Final Exam",
            score: e.score,
            maxScore: 100,
            date: null,
            attempts: e.attemptNumber,
            maxAttempts: e.attemptNumber,
          }));

          return {
            courseId: courseId,
            courseTitle: p.courseTitle,
            category: "",
            level: "",
            thumbnailUrl: "",
            enrolled: true,
            completed: p.overallProgressPercentage === 100,
            overallGrade: p.averageQuizScore,
            items: [...quizItems, ...examItems],
          };
        })
      );

      setCourses(finalCourses);
    };

    fetchData();
  }, [token]);

  const completedCourses = courses.filter((c) => c.completed).length;

  const allItems = courses.flatMap((c) =>
    c.items.map((i) => ({ ...i, courseTitle: c.courseTitle }))
  );

  const gradedAll = allItems.filter((i) => i.score !== null);

  const overallAvg =
    gradedAll.length > 0
      ? (
          gradedAll.reduce((s, i) => s + pct(i.score), 0) / gradedAll.length
        ).toFixed(1)
      : null;

  return (
    <div className="db-page">
      {/* Header */}
      <div className="db-hero">
        <h1 className="db-hero__name">My Grades</h1>
        <p className="catalog-header__sub">
          All courses, quizzes and exams
        </p>
      </div>

      {/* KPI */}
      <div className="grades-kpi-strip">
        <div className="grades-kpi">
          <span className="grades-kpi__val">{overallAvg ?? "—"}%</span>
          <span className="grades-kpi__label">Overall avg</span>
        </div>
        <div className="grades-kpi">
          <span className="grades-kpi__val">{courses.length}</span>
          <span className="grades-kpi__label">Courses</span>
        </div>
        <div className="grades-kpi">
          <span className="grades-kpi__val">{completedCourses}</span>
          <span className="grades-kpi__label">Completed</span>
        </div>
      </div>

      {/* By Course */}
      <div className="grades-section">
        <h2 className="grades-section__title">By Course</h2>
        <div className="gc-list">
          {courses.map((course) => (
            <CourseGradeCard key={course.courseId} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COURSE CARD (كما هو UI)
───────────────────────────────────────── */
function CourseGradeCard({ course }) {
  const [open, setOpen] = useState(false);
  const g = gradeLabel(course.overallGrade);

  const gradedItems = course.items.filter((i) => i.score !== null);

  return (
    <div className={`gc-card ${open ? "gc-card--open" : ""}`}>
      <div className="gc-card__header" onClick={() => setOpen(!open)}>
        <div className="gc-card__info">
          <h3 className="gc-card__title">{course.courseTitle}</h3>
          <p className="gc-card__sub">
            {gradedItems.length}/{course.items.length} graded
            {course.completed && (
              <span className="gc-card__completed-badge">✓ Completed</span>
            )}
          </p>
        </div>

        {/* <div className="gc-card__grade-area">
          {course.overallGrade !== null ? (
            <>
              <span
                className="gc-card__letter"
                style={{ background: g.bg, color: g.color }}
              >
                {g.letter}
              </span>
              <span className="gc-card__pct">
                {course.overallGrade.toFixed(1)}%
              </span>
            </>
          ) : (
            <span className="gc-card__in-progress">In progress</span>
          )}
        </div> */}
      </div>

      {open && (
        <div className="gc-card__body">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {course.items.map((item) => {
                const tm = TYPE_META[item.type];
                const p = pct(item.score);
                const gl = gradeLabel(p);

                return (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>
                      <span
                        className="grades-table__type-badge"
                        style={{ background: tm.bg, color: tm.color }}
                      >
                        {tm.label}
                      </span>
                    </td>
                    <td>{item.score ?? "Pending"}</td>
                    <td>
                      {p !== null ? (
                        <span style={{ color: gl.color }}>{p}%</span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}