import React, { useState } from "react";
// import "./dashboard.css";

/* ── Read current user ── */
const storedUser = JSON.parse(localStorage.getItem("lms_current_user") || "null");
const CURRENT_USER = storedUser || {
  firstName: "Youssef",
  lastName: "Zienhoum",
  email: "youssef@example.com",
  role: "STUDENT",
};

/* ── Mock data matching Question + Answer entities ── */
const INITIAL_THREADS = [
  {
    id: 1,
    course: { id: 1, title: "React from Zero to Hero" },
    questionText: "What is the difference between useEffect with an empty dependency array and componentDidMount?",
    questionType: "SHORT_ANSWER",
    author: { firstName: "Ahmed", lastName: "Tarek", role: "STUDENT" },
    createdAt: "2025-04-10T09:15:00",
    points: 3,
    resolved: true,
    upvotes: 14,
    answers: [
      {
        id: 1,
        answerText: "They are functionally equivalent in most cases. useEffect(() => {}, []) runs after the first render, same as componentDidMount. The key difference is that useEffect also handles the cleanup via its return function, which maps to componentWillUnmount.",
        author: { firstName: "Sara", lastName: "Ahmed", role: "INSTRUCTOR" },
        createdAt: "2025-04-10T10:30:00",
        isCorrect: true,
        upvotes: 9,
      },
    ],
  },
  {
    id: 2,
    course: { id: 1, title: "React from Zero to Hero" },
    questionText: "Why does my state update not reflect immediately after calling setState?",
    questionType: "MCQ",
    author: { firstName: "Nour", lastName: "Hassan", role: "STUDENT" },
    createdAt: "2025-04-12T14:00:00",
    points: 1,
    resolved: false,
    upvotes: 7,
    answers: [
      {
        id: 2,
        answerText: "React batches state updates for performance. The state value is not mutated immediately — it schedules a re-render. To get the latest value, use the functional form: setState(prev => prev + 1).",
        author: { firstName: "Youssef", lastName: "Zienhoum", role: "STUDENT" },
        createdAt: "2025-04-12T15:20:00",
        isCorrect: false,
        upvotes: 4,
      },
    ],
  },
  {
    id: 3,
    course: { id: 2, title: "Spring Boot & Microservices" },
    questionText: "What is the purpose of @Transactional annotation in Spring Boot?",
    questionType: "ESSAY",
    author: { firstName: "Lina", lastName: "Mostafa", role: "STUDENT" },
    createdAt: "2025-04-15T11:00:00",
    points: 2,
    resolved: false,
    upvotes: 5,
    answers: [],
  },
];

const COURSES = [
  { id: 1, title: "React from Zero to Hero" },
  { id: 2, title: "Spring Boot & Microservices" },
  { id: 4, title: "Data Structures & Algorithms" },
];

const TYPE_LABEL = {
  MCQ:          "MCQ",
  TRUE_FALSE:   "True/False",
  SHORT_ANSWER: "Short Answer",
  ESSAY:        "Essay",
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getInitials(u) {
  return `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase();
}

function AvatarBubble({ user, size = 36 }) {
  const isInstructor = user.role === "INSTRUCTOR";
  return (
    <div
      className="forum-avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: isInstructor ? "var(--sidebar-bg)" : "var(--gold)",
        color: isInstructor ? "#fff" : "#1a1a1a",
      }}
    >
      {getInitials(user)}
    </div>
  );
}

/* ── Thread card ── */
function ThreadCard({ thread, onOpenThread }) {
  return (
    <div
      className={`forum-thread-card ${thread.resolved ? "forum-thread-card--resolved" : ""}`}
      onClick={() => onOpenThread(thread)}
    >
      <div className="forum-thread-card__left">
        <AvatarBubble user={thread.author} />

      </div>

      <div className="forum-thread-card__body">
        <div className="forum-thread-card__meta">
          <span className="forum-thread-card__author">
            {thread.author.firstName} {thread.author.lastName}
          </span>
          <span className="forum-thread-card__course">{thread.course.title}</span>
          <span className="forum-thread-card__time">{timeAgo(thread.createdAt)}</span>
        </div>

        <p className="forum-thread-card__question">{thread.questionText}</p>
      </div>
    </div>
  );
}

/* ── Thread detail / Answer view ── */
function ThreadDetail({ thread, onBack, onAddAnswer }) {
  const [answerText, setAnswerText] = useState("");

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    onAddAnswer(thread.id, answerText.trim());
    setAnswerText("");
  };

  return (
    <div className="forum-detail">
      <button className="forum-detail__back" onClick={onBack}>← Back to Forum</button>

      {/* ── Original question ── */}
      <div className="forum-detail__question-card">
        <div className="forum-detail__question-header">
          <AvatarBubble user={thread.author} size={42} />
          <div>
            <p className="forum-detail__author">
              {thread.author.firstName} {thread.author.lastName}
              {thread.author.role === "INSTRUCTOR" && (
                <span className="forum-inst-badge">Instructor</span>
              )}
            </p>
            <p className="forum-detail__meta">
              {thread.course.title} 
            </p>
          </div>
          <div className="forum-detail__tags">
         
            {thread.resolved && <span className="forum-tag forum-tag--resolved">✓ Resolved</span>}
          </div>
        </div>
        <p className="forum-detail__question-text">{thread.questionText}</p>
      </div>

      {/* ── Answers ── */}
      <div className="forum-answers-section">
        <p className="forum-answers-section__title">
          {thread.answers.length} Answer{thread.answers.length !== 1 ? "s" : ""}
        </p>

        {/* {thread.answers.length === 0 && (
          <div className="forum-no-answers">
            <span>💬</span>
            <p>No answers yet. Be the first to help!</p>
          </div>
        )} */}

        {thread.answers.map((ans) => (
          <div
            key={ans.id}
            className={`forum-answer ${ans.isCorrect ? "forum-answer--correct" : ""}`}
          >
            <div className="forum-answer__left">
              <AvatarBubble user={ans.author} />

            </div>
            <div className="forum-answer__body">
              <div className="forum-answer__header">
                <span className="forum-answer__author">
                  {ans.author.firstName} {ans.author.lastName}
                  {ans.author.role === "INSTRUCTOR" && (
                    <span className="forum-inst-badge">Instructor</span>
                  )}
                </span>
                <span className="forum-answer__time">{timeAgo(ans.createdAt)}</span>
                {ans.isCorrect && (
                  <span className="forum-answer__accepted">✓ Accepted Answer</span>
                )}
              </div>
              <p className="forum-answer__text">{ans.answerText}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Write answer ── */}
      <div className="forum-write-answer">
        <div className="forum-write-answer__header">
          <AvatarBubble user={CURRENT_USER} />
          <p className="forum-write-answer__label">Your Answer</p>
        </div>
        <textarea
          className="forum-write-answer__area"
          placeholder="Write a detailed answer…"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={5}
        />
        <div className="forum-write-answer__footer">
          <span className="forum-write-answer__tip">
            Be specific and cite sources when possible.
          </span>
          <button
            className="forum-btn-submit"
            onClick={handleSubmitAnswer}
            disabled={!answerText.trim()}
          >
            Post Answer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── New question modal ── */
function AskModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    courseId: COURSES[0].id,
    questionText: "",
    questionType: "SHORT_ANSWER",
  });

  const handleSubmit = () => {
    if (!form.questionText.trim()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div className="forum-modal-overlay" onClick={onClose}>
      <div className="forum-modal" onClick={(e) => e.stopPropagation()}>
        <div className="forum-modal__header">
          <h2 className="forum-modal__title">Ask a Question</h2>
          <button className="forum-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="forum-modal__body">
          <label className="forum-field-label">Course</label>
          <select
            className="forum-select"
            value={form.courseId}
            onChange={(e) => setForm({ ...form, courseId: +e.target.value })}
          >
            {COURSES.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <label className="forum-field-label">Question Type</label>
          <div className="forum-type-pills">
            {Object.entries(TYPE_LABEL).map(([val, label]) => (
              <button
                key={val}
                className={`forum-type-pill ${form.questionType === val ? "forum-type-pill--active" : ""}`}
                onClick={() => setForm({ ...form, questionType: val })}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <label className="forum-field-label">Your Question</label>
          <textarea
            className="forum-modal__textarea"
            placeholder="Describe your question in detail…"
            value={form.questionText}
            onChange={(e) => setForm({ ...form, questionText: e.target.value })}
            rows={5}
          />
        </div>

        <div className="forum-modal__footer">
          <button className="forum-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="forum-btn-submit"
            onClick={handleSubmit}
            disabled={!form.questionText.trim()}
          >
            Post Question
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Forum page ── */
export default function Forum() {
  const [threads, setThreads]     = useState(INITIAL_THREADS);
  const [activeThread, setActiveThread] = useState(null);
  const [showAsk, setShowAsk]     = useState(false);
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");

  const handleNewQuestion = (form) => {
    const course = COURSES.find((c) => c.id === form.courseId);
    const newThread = {
      id: Date.now(),
      course,
      questionText: form.questionText,
      questionType: form.questionType,
      author: CURRENT_USER,
      createdAt: new Date().toISOString(),
      points: 1,
      resolved: false,
      upvotes: 0,
      answers: [],
    };
    setThreads((prev) => [newThread, ...prev]);
  };

  const handleAddAnswer = (threadId, text) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          answers: [
            ...t.answers,
            {
              id: Date.now(),
              answerText: text,
              author: CURRENT_USER,
              createdAt: new Date().toISOString(),
              isCorrect: false,
              upvotes: 0,
            },
          ],
        };
      })
    );
    /* Update active thread reference */
    setActiveThread((prev) =>
      prev?.id === threadId
        ? {
            ...prev,
            answers: [
              ...prev.answers,
              {
                id: Date.now(),
                answerText: text,
                author: CURRENT_USER,
                createdAt: new Date().toISOString(),
                isCorrect: false,
                upvotes: 0,
              },
            ],
          }
        : prev
    );
  };

  const filtered = threads.filter((t) => {
    if (filter === "resolved"   && !t.resolved)  return false;
    if (filter === "unanswered" && t.answers.length > 0) return false;
    if (filter === "mine" && t.author.email !== CURRENT_USER.email) return false;
    if (search && !t.questionText.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (activeThread) {
    return (
      <div className="forum-page">
        <ThreadDetail
          thread={activeThread}
          onBack={() => setActiveThread(null)}
          onAddAnswer={handleAddAnswer}
        />
      </div>
    );
  }

  return (
    <div className="cd-page"  >
      {/* ── Header ── */}
      <div className="db-hero ">
        <div>
          <h1 className="db-hero__name">Forum & Q&A</h1>
          <p className="catalog-header__sub">
            {threads.length} questions · {threads.filter((t) => t.resolved).length} resolved
          </p>
        </div>

      </div>

      {/* ── Thread list ── */}
      <div className="forum-list">
        {filtered.length === 0 ? (
          <div className="forum-empty">
            <p>No questions match your filter.</p>
            <button className="forum-ask-btn" onClick={() => setShowAsk(true)}>
              Ask the first question
            </button>
          </div>
        ) : (
          filtered.map((t) => (
            <ThreadCard key={t.id} thread={t} onOpenThread={setActiveThread} />
          ))
        )}
      </div>

      {/* ── Modal ── */}
      {showAsk && (
        <AskModal onClose={() => setShowAsk(false)} onSubmit={handleNewQuestion} />
      )}
<div className="addNewComment" >
                <button className="forum-ask-btn" onClick={() => setShowAsk(true)}>
          + Ask a Question
        </button>
</div>


    </div>
  );
}