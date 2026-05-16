import React, { useState } from "react";
import "./instructor.css";

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: "Build a React Todo App",
    course: "React from Zero to Hero",
    deadline: "2025-05-10",
    submissions: [
      { id: 1, student: { firstName: "Youssef", lastName: "Zienhoum", email: "youssef@mail.com" }, submittedAt: "2025-05-08T14:30:00", fileUrl: "https://github.com/student/todo", grade: 88, feedback: "Clean code, great use of hooks. Minor deduction for missing error boundary." },
      { id: 2, student: { firstName: "Nour",    lastName: "Hassan",   email: "nour@mail.com"    }, submittedAt: "2025-05-09T20:00:00", fileUrl: "https://github.com/nour/todo",    grade: null, feedback: "" },
      { id: 3, student: { firstName: "Lina",    lastName: "Mostafa",  email: "lina@mail.com"    }, submittedAt: "2025-05-10T22:50:00", fileUrl: "react-todo.zip",                  grade: null, feedback: "" },
      { id: 4, student: { firstName: "Kareem",  lastName: "El-Din",   email: "kareem@mail.com"  }, submittedAt: null,                   fileUrl: null,                              grade: null, feedback: "" },
    ],
  },
  {
    id: 2,
    title: "TypeScript Generics Exercise",
    course: "Advanced TypeScript Patterns",
    deadline: "2025-05-20",
    submissions: [
      { id: 5, student: { firstName: "Ahmed", lastName: "Tarek", email: "ahmed@mail.com" }, submittedAt: "2025-05-18T10:00:00", fileUrl: "generics.zip", grade: null, feedback: "" },
      { id: 6, student: { firstName: "Omar",  lastName: "Fathy", email: "omar@mail.com"  }, submittedAt: "2025-05-17T15:00:00", fileUrl: "https://github.com/omar/ts", grade: 92, feedback: "Excellent. Very clean generic constraints." },
    ],
  },
];

function getInitials(s) {
  return `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();
}

function formatDT(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ─────────────────────────────────────────
   GRADE PANEL (slide-in)
───────────────────────────────────────── */
function GradePanel({ submission, onClose, onSave }) {
  const [grade,    setGrade]    = useState(submission.grade ?? "");
  const [feedback, setFeedback] = useState(submission.feedback ?? "");
  const [saving,   setSaving]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave(submission.id, { grade: Number(grade), feedback });
    setSaving(false);
    onClose();
  };

  const pct = grade !== "" ? Math.round((Number(grade) / 100) * 100) : 0;
  const gradeColor = pct >= 85 ? "#15803d" : pct >= 70 ? "#92400e" : "#991b1b";

  return (
    <div className="ip-drawer-overlay" onClick={onClose}>
      <div className="ip-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="ip-drawer__header">
          <div className="ip-drawer__avatar">{getInitials(submission.student)}</div>
          <div>
            <h2 className="ip-drawer__name">{submission.student.firstName} {submission.student.lastName}</h2>
            <p className="ip-drawer__email">{submission.student.email}</p>
          </div>
          <button className="ip-drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="ip-drawer__body">
          {/* File link */}
          {submission.fileUrl && (
            <div className="ip-drawer__row">
              <span className="ip-drawer__label">Submission</span>
              <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="ip-file-link">
                📎 {submission.fileUrl.split("/").pop()}
              </a>
            </div>
          )}
          <div className="ip-drawer__row">
            <span className="ip-drawer__label">Submitted</span>
            <span className="ip-drawer__val">{formatDT(submission.submittedAt)}</span>
          </div>

          {/* Grade input */}
          <div className="ip-grade-input-section">
            <label className="ip-drawer__label">Grade (out of 100)</label>
            <div className="ip-grade-input-row">
              <input
                type="number" min="0" max="100"
                className="ip-grade-input"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="0–100"
              />
              {grade !== "" && (
                <span className="ip-grade-live" style={{ color: gradeColor }}>
                  {grade}/100
                </span>
              )}
            </div>
            {grade !== "" && (
              <div className="ip-prog-bar" style={{ marginTop: 6 }}>
                <div className="ip-prog-bar__fill" style={{ width: `${pct}%`, background: gradeColor }} />
              </div>
            )}
          </div>

          {/* Feedback */}
          <div className="ip-grade-feedback-section">
            <label className="ip-drawer__label">Feedback to Student</label>
            <textarea
              className="ip-feedback-area"
              rows={5}
              placeholder="Write your feedback here…"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
        </div>

        <div className="ip-drawer__footer">
          <button className="ins-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ins-btn-primary" onClick={handleSave} disabled={saving || grade === ""}>
            {saving ? "Saving…" : "Save Grade"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function AssignmentGrading() {
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [openAsgn,    setOpenAsgn]    = useState(null);
  const [grading,     setGrading]     = useState(null);

  const handleSaveGrade = (submissionId, { grade, feedback }) => {
    setAssignments((prev) =>
      prev.map((a) => ({
        ...a,
        submissions: a.submissions.map((s) =>
          s.id === submissionId ? { ...s, grade, feedback } : s
        ),
      }))
    );
  };

  const gradingSubmission = grading
    ? assignments.flatMap((a) => a.submissions).find((s) => s.id === grading)
    : null;

  return (
    <div className="ins-page">
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Assignment Grading</h1>
          <p className="pg-header__sub">{assignments.length} assignments · {assignments.reduce((s, a) => s + a.submissions.filter((sub) => sub.grade === null && sub.submittedAt).length, 0)} pending review</p>
        </div>
      </div>

      <div className="ip-asgn-list">
        {assignments.map((a) => {
          const submitted = a.submissions.filter((s) => s.submittedAt !== null);
          const graded    = a.submissions.filter((s) => s.grade !== null);
          const pending   = submitted.filter((s) => s.grade === null);
          const isOpen    = openAsgn === a.id;

          return (
            <div key={a.id} className={`ip-asgn-card ${isOpen ? "ip-asgn-card--open" : ""}`}>
              {/* Header */}
              <div className="ip-asgn-card__header" onClick={() => setOpenAsgn(isOpen ? null : a.id)}>
                <div className="ip-asgn-card__left">
                  <span className="ip-asgn-card__icon">📂</span>
                  <div>
                    <p className="ip-asgn-card__course">{a.course}</p>
                    <h3 className="ip-asgn-card__title">{a.title}</h3>
                  </div>
                </div>
                <div className="ip-asgn-card__right">
                  <div className="ip-asgn-pill ip-asgn-pill--total">{submitted.length} submitted</div>
                  {pending.length > 0 && (
                    <div className="ip-asgn-pill ip-asgn-pill--pending">{pending.length} to grade</div>
                  )}
                  <div className="ip-asgn-pill ip-asgn-pill--graded">{graded.length} graded</div>
                  <span className={`ip-chevron ${isOpen ? "ip-chevron--open" : ""}`}>›</span>
                </div>
              </div>

              {/* Submissions table */}
              {isOpen && (
                <div className="ip-asgn-card__body">
                  <table className="ip-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Submitted</th>
                        <th>File</th>
                        <th>Grade</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.submissions.map((sub) => (
                        <tr key={sub.id} className="ip-table__row">
                          <td>
                            <div className="ip-student-info">
                              <div className="ip-student-avatar">{getInitials(sub.student)}</div>
                              <div>
                                <p className="ip-student-name">{sub.student.firstName} {sub.student.lastName}</p>
                                <p className="ip-student-email">{sub.student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="ip-date-cell">
                            {sub.submittedAt ? formatDT(sub.submittedAt) : <span className="ip-pending-text">Not submitted</span>}
                          </td>
                          <td>
                            {sub.fileUrl
                              ? <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="ip-file-link">📎 View</a>
                              : <span className="ip-pending-text">—</span>}
                          </td>
                          <td>
                            {sub.grade !== null
                              ? <span className="ip-grade-badge">{sub.grade}%</span>
                              : sub.submittedAt
                                ? <span className="ip-asgn-pill ip-asgn-pill--pending">Pending</span>
                                : <span className="ip-pending-text">—</span>
                            }
                          </td>
                          <td>
                            {sub.submittedAt && (
                              <button
                                className={`ip-grade-btn ${sub.grade !== null ? "ip-grade-btn--edit" : ""}`}
                                onClick={() => setGrading(sub.id)}
                              >
                                {sub.grade !== null ? "✏ Edit" : "Grade"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {gradingSubmission && (
        <GradePanel
          submission={gradingSubmission}
          onClose={() => setGrading(null)}
          onSave={handleSaveGrade}
        />
      )}
    </div>
  );
}