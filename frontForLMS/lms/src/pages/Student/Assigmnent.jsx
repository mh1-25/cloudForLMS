import React, { useState, useRef } from "react";
import BASE_URL from "../../config/url";
const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: "Build a React Todo App",
    description:
      "Create a fully functional todo application using React hooks. Must include: add/delete/complete tasks, filter by status, localStorage persistence, and responsive design. Submit a GitHub repository link and a live demo URL.",
    course: { id: 1, title: "React from Zero to Hero" },
    deadline: "2025-05-10T23:59:00",
    maxScore: 100,
    allowResubmit: true,
    submission: {
      id: 1,
      submittedAt: "2025-05-08T14:30:00",
      fileUrl: "https://github.com/student/react-todo",
      grade: 88,
      feedback:
        "Excellent work! Clean component structure and great use of useReducer. Minor deduction for missing error boundary. Overall very impressive.",
      gradedAt: "2025-05-09T10:00:00",
    },
  },
  {
    id: 2,
    title: "REST API Design Document",
    description:
      "Design a RESTful API for a library management system. Include endpoint documentation, request/response schemas, authentication strategy, and error handling. Submit as a PDF document.",
    course: { id: 2, title: "Spring Boot & Microservices" },
    deadline: "2025-05-20T23:59:00",
    maxScore: 100,
    allowResubmit: false,
    submission: {
      id: 2,
      submittedAt: "2025-05-19T22:10:00",
      fileUrl: "api-design.pdf",
      grade: null,
      feedback: null,
      gradedAt: null,
    },
  },
  {
    id: 3,
    title: "Algorithm Complexity Analysis",
    description:
      "Analyze the time and space complexity of 5 given algorithms. Provide Big-O notation, best/worst/average case analysis, and suggest optimizations where possible. Submit as a written report (PDF or Word).",
    course: { id: 4, title: "Data Structures & Algorithms" },
    deadline: "2025-04-30T23:59:00",
    maxScore: 100,
    allowResubmit: true,
    submission: null,
  },
  {
    id: 4,
    title: "Neural Network from Scratch",
    description:
      "Implement a simple feedforward neural network using only NumPy. Train it on the MNIST dataset and achieve at least 90% accuracy. Submit Jupyter notebook with full explanation.",
    course: { id: 5, title: "Machine Learning with Python" },
    deadline: "2025-06-01T23:59:00",
    maxScore: 100,
    allowResubmit: true,
    submission: null,
  },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function deadlineStatus(iso) {
  const now  = Date.now();
  const end  = new Date(iso).getTime();
  const diff = end - now;
  if (diff < 0)            return { label: "Overdue",      color: "#991b1b",  bg: "#fee2e2" };
  if (diff < 86400000)     return { label: "Due today",    color: "#92400e",  bg: "#fef3c7" };
  if (diff < 86400000 * 3) return { label: "Due soon",     color: "#1d4ed8",  bg: "#eff6ff" };
  return                          { label: formatDate(iso), color: "#6b6b6b",  bg: "#f5f3ef" };
}

function scoreColor(score, max) {
  const pct = (score / max) * 100;
  if (pct >= 85) return { color: "#15803d", bg: "#dcfce7" };
  if (pct >= 70) return { color: "#92400e", bg: "#fef3c7" };
  return               { color: "#991b1b",  bg: "#fee2e2" };
}

/* ─────────────────────────────────────────
   SUBMIT MODAL
───────────────────────────────────────── */
function SubmitModal({ assignment, onClose, onSubmit }) {
  const [text, setText]       = useState("");
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = () => {
    if (!file && !text.trim()) return;
    onSubmit(assignment.id, { text, file });
    onClose();
  };

  return (
    <div className="asgn-modal-overlay" onClick={onClose}>
      <div className="asgn-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="asgn-modal__header">
          <div>
            <p className="asgn-modal__course">{assignment.course.title}</p>
            <h2 className="asgn-modal__title">{assignment.title}</h2>
          </div>
          <button className="asgn-modal__close" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="asgn-modal__body">
          {/* Description reminder */}
          <div className="asgn-brief">
            <p className="asgn-brief__text">{assignment.description}</p>
            <span className="asgn-brief__deadline">
              Deadline: {formatDateTime(assignment.deadline)}
            </span>
          </div>

          {/* File drop zone */}
          <div
            className={`asgn-dropzone ${dragging ? "asgn-dropzone--drag" : ""} ${file ? "asgn-dropzone--has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
          >
            <input
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.doc,.docx,.zip,.ipynb,.md"
            />
            {file ? (
              <>
                <span className="asgn-dropzone__icon">📄</span>
                <p className="asgn-dropzone__filename">{file.name}</p>
                <button
                  className="asgn-dropzone__remove"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <span className="asgn-dropzone__icon">⬆</span>
                <p className="asgn-dropzone__main">Drag & drop your file here</p>
                <p className="asgn-dropzone__sub">PDF, DOC, ZIP, IPYNB · Click to browse</p>
              </>
            )}
          </div>

          {/* OR divider */}
          <div className="asgn-or-divider">
            <span>or paste a link</span>
          </div>

          <input
            type="text"
            className="asgn-link-input"
            placeholder="https://github.com/your-repo  or  https://your-demo-link"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="asgn-modal__footer">
          <button className="asgn-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="asgn-btn-submit"
            onClick={handleSubmit}
            disabled={!file && !text.trim()}
          >
            Submit Assignment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ASSIGNMENT CARD
───────────────────────────────────────── */
function AssignmentCard({ assignment, onSubmit }) {
  const [expanded, setExpanded] = useState(false);
  const { submission } = assignment;
  const dl = deadlineStatus(assignment.deadline);

  const status = !submission
    ? { label: "Not submitted", color: "#6b6b6b", bg: "#f5f3ef" }
    : submission.grade !== null
      ? { label: "Graded", color: "#15803d", bg: "#dcfce7" }
      : { label: "Under review", color: "#1d4ed8", bg: "#eff6ff" };

  const sc = submission?.grade !== null && submission?.grade != null
    ? scoreColor(submission.grade, assignment.maxScore)
    : null;

  return (
    <div className={`asgn-card ${submission?.grade !== null && submission?.grade != null ? "asgn-card--graded" : ""}`}>
      <div className="asgn-card__header" onClick={() => setExpanded(!expanded)}>
        <div className="asgn-card__left">
          <div>
            <p className="asgn-card__course">{assignment.course.title}</p>
            <h3 className="asgn-card__title">{assignment.title}</h3>
          </div>
        </div>

        <div className="asgn-card__right">
          {sc && (
            <span
              className="asgn-score-pill"
              style={{ background: sc.bg, color: sc.color }}
            >
              {submission.grade}/{assignment.maxScore}
            </span>
          )}

  

          <span className={`asgn-chevron ${expanded ? "asgn-chevron--open" : ""}`}>›</span>
        </div>
      </div>

      {/* ── Expanded body ── */}
      {expanded && (
        <div className="asgn-card__body">
          {/* Description */}
          <p className="asgn-card__desc">{assignment.description}</p>

          {/* Submission detail */}
          {submission && (
            <div className="asgn-submission-block">
              <div className="asgn-submission-block__header">
                <span className="asgn-submission-block__label">Your submission</span>
                <span className="asgn-submission-block__date">
                  Submitted {formatDateTime(submission.submittedAt)}
                </span>
              </div>

              {submission.fileUrl && (
                <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="asgn-file-link">
                  📎 {submission.fileUrl.split("/").pop()}
                </a>
              )}

              {/* Grade & feedback */}
              {submission.grade !== null && (
                <div className="asgn-feedback-block">
                  <div className="asgn-feedback-score">
                    <span
                      className="asgn-feedback-score__num"
                      style={{ color: sc?.color }}
                    >
                      {submission.grade}
                    </span>
                    <span className="asgn-feedback-score__max">/ {assignment.maxScore}</span>
                  </div>
                  {submission.feedback && (
                    <div className="asgn-feedback-text">
                      <p className="asgn-feedback-text__label">Instructor Feedback</p>
                      <p className="asgn-feedback-text__body">{submission.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              {submission.grade === null && (
                <p className="asgn-pending-note">
                  ⏳ Your submission is being reviewed by the instructor.
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="asgn-card__actions">
            {!submission && (
              <button className="asgn-btn-submit-card" onClick={() => onSubmit(assignment)}>
                ⬆ Submit Assignment
              </button>
            )}
            {submission && assignment.allowResubmit && (
              <button className="asgn-btn-resubmit" onClick={() => onSubmit(assignment)}>
                ↺ Resubmit
              </button>
            )}
            <a href={`/student/player?course=${assignment.course.id}`} className="asgn-btn-course">
              Go to Course →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const FILTERS = ["All", "Pending", "Submitted", "Graded", "Overdue"];

export default function Assignments() {
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [modalFor, setModalFor]       = useState(null);
  const [filter, setFilter]           = useState("All");

  const handleSubmit = (assignmentId, data) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id !== assignmentId
          ? a
          : {
              ...a,
              submission: {
                id: Date.now(),
                submittedAt: new Date().toISOString(),
                fileUrl: data.file?.name || data.text,
                grade: null,
                feedback: null,
                gradedAt: null,
              },
            }
      )
    );
  };

  const filtered = assignments.filter((a) => {
    if (filter === "All")       return true;
    if (filter === "Pending")   return !a.submission;
    if (filter === "Submitted") return a.submission && a.submission.grade === null;
    if (filter === "Graded")    return a.submission?.grade !== null && a.submission?.grade != null;
    if (filter === "Overdue")   return !a.submission && new Date(a.deadline) < new Date();
    return true;
  });

  const stats = {
    total:     assignments.length,
    pending:   assignments.filter((a) => !a.submission).length,
    submitted: assignments.filter((a) => a.submission && a.submission.grade === null).length,
    graded:    assignments.filter((a) => a.submission?.grade !== null && a.submission?.grade != null).length,
  };

  return (
    <div className="asgn-page">
      {/* ── Header ── */}
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Assignments</h1>
          <p className="pg-header__sub">
            {stats.total} total · {stats.pending} pending · {stats.graded} graded
          </p>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="asgn-stats-strip">
        <div className="asgn-stat-box">
          <span className="asgn-stat-box__val">{stats.total}</span>
          <span className="asgn-stat-box__label">Total</span>
        </div>
        <div className="asgn-stat-box asgn-stat-box--warn">
          <span className="asgn-stat-box__val">{stats.pending}</span>
          <span className="asgn-stat-box__label">Pending</span>
        </div>
        <div className="asgn-stat-box asgn-stat-box--info">
          <span className="asgn-stat-box__val">{stats.submitted}</span>
          <span className="asgn-stat-box__label">Under Review</span>
        </div>
        <div className="asgn-stat-box asgn-stat-box--success">
          <span className="asgn-stat-box__val">{stats.graded}</span>
          <span className="asgn-stat-box__label">Graded</span>
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="pg-filter-row">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`pg-pill ${filter === f ? "pg-pill--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Assignment list ── */}
      <div className="asgn-list">
        {filtered.length === 0 ? (
          <div className="pg-empty">
            <span>📭</span>
            <p>No assignments match this filter.</p>
          </div>
        ) : (
          filtered.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              onSubmit={(asgn) => setModalFor(asgn)}
            />
          ))
        )}
      </div>

      {/* ── Modal ── */}
      {modalFor && (
        <SubmitModal
          assignment={modalFor}
          onClose={() => setModalFor(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}