import React, { useState } from "react";
import "./instructor.css";

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const CURRENT_INSTRUCTOR = JSON.parse(localStorage.getItem("lms_current_user")) || {
  firstName: "Sara", lastName: "Ahmed", role: "INSTRUCTOR",
};

const INITIAL_THREADS = [
  {
    id: 1, course: "React from Zero to Hero",
    question: "What is the difference between useEffect with an empty array and componentDidMount?",
    type: "SHORT_ANSWER",
    author: { firstName: "Youssef", lastName: "Zienhoum", role: "STUDENT" },
    createdAt: "2025-04-10T09:15:00",
    upvotes: 14, resolved: true,
    answers: [
      { id: 1, text: "They are functionally equivalent. useEffect with [] runs after the first render. The key difference is useEffect also handles cleanup via its return function, mapping to componentWillUnmount.", author: { firstName: "Sara", lastName: "Ahmed", role: "INSTRUCTOR" }, createdAt: "2025-04-10T10:30:00", upvotes: 9, isInstructor: true },
    ],
  },
  {
    id: 2, course: "React from Zero to Hero",
    question: "Why does my state update not reflect immediately after calling setState?",
    type: "MCQ",
    author: { firstName: "Nour", lastName: "Hassan", role: "STUDENT" },
    createdAt: "2025-04-12T14:00:00",
    upvotes: 7, resolved: false,
    answers: [
      { id: 2, text: "React batches state updates for performance. Use the functional form setState(prev => prev + 1) to access the latest value.", author: { firstName: "Lina", lastName: "Mostafa", role: "STUDENT" }, createdAt: "2025-04-12T15:20:00", upvotes: 4, isInstructor: false },
    ],
  },
  {
    id: 3, course: "Advanced TypeScript Patterns",
    question: "How do I write a generic function that accepts both arrays and single values?",
    type: "ESSAY",
    author: { firstName: "Ahmed", lastName: "Tarek", role: "STUDENT" },
    createdAt: "2025-04-15T11:00:00",
    upvotes: 5, resolved: false,
    answers: [],
  },
  {
    id: 4, course: "React from Zero to Hero",
    question: "Can useContext replace Redux completely?",
    type: "SHORT_ANSWER",
    author: { firstName: "Kareem", lastName: "El-Din", role: "STUDENT" },
    createdAt: "2025-04-18T08:00:00",
    upvotes: 11, resolved: false,
    answers: [],
  },
];

const COURSES = ["All Courses", "React from Zero to Hero", "Advanced TypeScript Patterns"];

function getInitials(u) {
  return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ─────────────────────────────────────────
   THREAD DETAIL
───────────────────────────────────────── */
function ThreadDetail({ thread, onBack, onReply, onResolve }) {
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(thread.id, replyText.trim());
    setReplyText("");
  };

  return (
    <div className="ip-forum-detail">
      <button className="ip-forum-back" onClick={onBack}>← Back to Q&A</button>

      <div className="ip-forum-question-card">
        <div className="ip-forum-question-header">
          <div className="ip-forum-avatar ip-forum-avatar--student">{getInitials(thread.author)}</div>
          <div>
            <p className="ip-forum-author">{thread.author.firstName} {thread.author.lastName}</p>
            <p className="ip-forum-meta">{thread.course} · {timeAgo(thread.createdAt)}</p>
          </div>
          <div className="ip-forum-question-actions">
            {!thread.resolved && (
              <button className="ins-btn-primary ip-resolve-btn" onClick={() => onResolve(thread.id)}>
                ✓ Mark Resolved
              </button>
            )}
            {thread.resolved && <span className="ip-resolved-badge">✓ Resolved</span>}
          </div>
        </div>
        <p className="ip-forum-question-text">{thread.question}</p>
      </div>

      <div className="ip-forum-answers">
        <p className="ip-forum-answers-title">
          {thread.answers.length} Answer{thread.answers.length !== 1 ? "s" : ""}
        </p>

        {thread.answers.length === 0 && (
          <div className="ip-forum-no-answers">
            <p>No answers yet. Be the first to respond!</p>
          </div>
        )}

        {thread.answers.map((ans) => (
          <div key={ans.id} className={`ip-forum-answer ${ans.isInstructor ? "ip-forum-answer--instructor" : ""}`}>
            <div
              className="ip-forum-avatar"
              style={{ background: ans.isInstructor ? "var(--sidebar-bg)" : "var(--gold)", color: ans.isInstructor ? "#fff" : "#1a1a1a" }}
            >
              {getInitials(ans.author)}
            </div>
            <div className="ip-forum-answer-body">
              <div className="ip-forum-answer-header">
                <span className="ip-forum-author">{ans.author.firstName} {ans.author.lastName}</span>
                {ans.isInstructor && <span className="ip-instructor-tag">Instructor</span>}
                <span className="ip-forum-time">{timeAgo(ans.createdAt)}</span>
                <span className="ip-forum-upvote">▲ {ans.upvotes}</span>
              </div>
              <p className="ip-forum-answer-text">{ans.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reply box */}
      <div className="ip-forum-reply-box">
        <div
          className="ip-forum-avatar ip-forum-avatar--instructor"
          style={{ background: "var(--sidebar-bg)", color: "#fff", flexShrink: 0 }}
        >
          {getInitials(CURRENT_INSTRUCTOR)}
        </div>
        <div className="ip-forum-reply-input-wrap">
          <textarea
            className="ip-feedback-area"
            rows={4}
            placeholder="Write your answer as an instructor…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="ip-forum-reply-footer">
            <span className="ip-forum-reply-note">Your reply will show an Instructor badge.</span>
            <button
              className="ins-btn-primary"
              onClick={handleReply}
              disabled={!replyText.trim()}
            >
              Post Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function Forum() {
  const [threads,       setThreads]       = useState(INITIAL_THREADS);
  const [activeThread,  setActiveThread]  = useState(null);
  const [filter,        setFilter]        = useState("all");
  const [courseFilter,  setCourseFilter]  = useState("All Courses");
  const [search,        setSearch]        = useState("");

  const handleReply = (threadId, text) => {
    const newAnswer = {
      id:           Date.now(),
      text,
      author:       CURRENT_INSTRUCTOR,
      createdAt:    new Date().toISOString(),
      upvotes:      0,
      isInstructor: true,
    };
    setThreads((prev) =>
      prev.map((t) => t.id !== threadId ? t : { ...t, answers: [...t.answers, newAnswer] })
    );
    setActiveThread((prev) => prev ? { ...prev, answers: [...prev.answers, newAnswer] } : prev);
  };

  const handleResolve = (threadId) => {
    setThreads((prev) =>
      prev.map((t) => t.id !== threadId ? t : { ...t, resolved: true })
    );
    setActiveThread((prev) => prev ? { ...prev, resolved: true } : prev);
  };

  const filtered = threads.filter((t) => {
    if (filter === "unanswered" && t.answers.length > 0)          return false;
    if (filter === "resolved"   && !t.resolved)                   return false;
    if (filter === "unresolved" && t.resolved)                    return false;
    if (courseFilter !== "All Courses" && t.course !== courseFilter) return false;
    if (search && !t.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unansweredCount = threads.filter((t) => t.answers.length === 0).length;
  const unresolvedCount = threads.filter((t) => !t.resolved).length;

  if (activeThread) {
    return (
      <div className="ins-page">
        <div style={{ padding: "1.5rem 2.5rem" }}>
          <ThreadDetail
            thread={activeThread}
            onBack={() => setActiveThread(null)}
            onReply={handleReply}
            onResolve={handleResolve}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="ins-page">
      {/* Header */}
      <div className="pg-header">
        <div>
          <h1 className="pg-header__title">Forum Q&A</h1>
          <p className="pg-header__sub">
            {threads.length} questions · {unansweredCount} unanswered · {unresolvedCount} unresolved
          </p>
        </div>
      </div>


      {/* Controls */}
      <div className="ip-controls">
        <div className="ip-search-wrap">
          <input className="ip-search" placeholder="Search questions…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          {search && <button className="ip-search-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        <select className="ip-select" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          {COURSES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <div className="ip-filter-pills">
          {[
            { key: "all",        label: "All" },
            { key: "unanswered", label: `Unanswered (${unansweredCount})` },
            { key: "unresolved", label: `Unresolved (${unresolvedCount})` },
            { key: "resolved",   label: "Resolved" },
          ].map((f) => (
            <button key={f.key}
              className={`ip-filter-pill ${filter === f.key ? "ip-filter-pill--active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ip-forum-list">
        {filtered.length === 0 ? (
          <div className="pg-empty"><span></span><p>No questions match your filter.</p></div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className={`ip-forum-thread-card ${t.resolved ? "ip-forum-thread-card--resolved" : ""} ${t.answers.length === 0 ? "ip-forum-thread-card--urgent" : ""}`}
              onClick={() => setActiveThread(t)}
            >
              <div className="ip-forum-thread-left">
                <div className="ip-forum-avatar ip-forum-avatar--student">{getInitials(t.author)}</div>
                <div className="ip-forum-upvote-col">
                  <span className="ip-forum-upvote-count">{t.upvotes}</span>
                  <span style={{ fontSize: 9, color: "var(--text-muted)" }}>votes</span>
                </div>
              </div>

              <div className="ip-forum-thread-body">
                <div className="ip-forum-thread-meta">
                  <span className="ip-forum-thread-author">{t.author.firstName} {t.author.lastName}</span>
                  <span className="ip-forum-thread-course">{t.course}</span>
                  <span className="ip-forum-thread-time">{timeAgo(t.createdAt)}</span>
                </div>
                <p className="ip-forum-thread-question">{t.question}</p>

              </div>

              <span className="ip-chevron">›</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}