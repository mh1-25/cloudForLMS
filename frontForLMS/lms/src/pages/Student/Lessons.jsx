import React, { useState } from "react";
import "./pages.css";

/* ── Mock data matching Lesson entity ── */
const MOCK_COURSE = {
  id: 1,
  title: "React from Zero to Hero",
  instructor: { firstName: "Sara", lastName: "Ahmed" },
  totalLessons: 8,
  totalDuration: 320,
  category: { name: "Web Development" },
};

const MOCK_LESSONS = [
  {
    id: 1,
    title: "Introduction & Environment Setup",
    description: "Get your dev environment ready. We cover Node.js, Vite, and VS Code extensions for the best React experience.",
    videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    duration: 18,
    lessonOrder: 1,
    preview: true,
    quizzes: [],
  },
  {
    id: 2,
    title: "JSX & Component Basics",
    description: "Understand what JSX really compiles to, how to write your first component, and the rules that govern JSX syntax.",
    videoUrl: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    duration: 24,
    lessonOrder: 2,
    preview: false,
    quizzes: [{ id: 1, title: "JSX Quiz" }],
  },
  {
    id: 3,
    title: "Props & State",
    description: "Master data flow in React — how to pass data down via props and maintain component-local state with useState.",
    videoUrl: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    duration: 32,
    lessonOrder: 3,
    preview: false,
    quizzes: [],
  },
  {
    id: 4,
    title: "useEffect & Side Effects",
    description: "Learn the lifecycle of a React component through useEffect — data fetching, subscriptions, and cleanup.",
    videoUrl: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
    duration: 41,
    lessonOrder: 4,
    preview: false,
    quizzes: [{ id: 2, title: "Hooks Quiz" }],
  },
  {
    id: 5,
    title: "Context API & Global State",
    description: "Eliminate prop drilling with React Context. We build a theme switcher and a cart system from scratch.",
    videoUrl: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&q=80",
    duration: 38,
    lessonOrder: 5,
    preview: false,
    quizzes: [],
  },
  {
    id: 6,
    title: "React Router v6",
    description: "Build multi-page SPAs with React Router — nested routes, dynamic segments, loaders, and protected routes.",
    videoUrl: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    duration: 45,
    lessonOrder: 6,
    preview: false,
    quizzes: [],
  },
  {
    id: 7,
    title: "Performance Optimization",
    description: "React.memo, useMemo, useCallback — when and why to use each. Plus lazy loading and code splitting.",
    videoUrl: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    duration: 36,
    lessonOrder: 7,
    preview: false,
    quizzes: [],
  },
  {
    id: 8,
    title: "Final Project — Build a Full App",
    description: "Put everything together: build a fully working task management app with auth, routing, and persistent state.",
    videoUrl: null,
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    duration: 86,
    lessonOrder: 8,
    preview: false,
    quizzes: [{ id: 3, title: "Final Assessment" }],
  },
];

/* completed lesson IDs (mock progress) */
const COMPLETED = new Set([1, 2, 3]);

function fmtDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function fmtTotal(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

export default function Lessons() {
  const [activeLesson, setActiveLesson] = useState(null);
  const completedCount = MOCK_LESSONS.filter((l) => COMPLETED.has(l.id)).length;
  const progressPct = Math.round((completedCount / MOCK_LESSONS.length) * 100);

  return (
    <div className="lsn-page">
      {/* ── Hero header ── */}
      <div className="lsn-hero">
        <div className="lsn-hero__left">
          <span className="lsn-hero__cat">{MOCK_COURSE.category.name}</span>
          <h1 className="lsn-hero__title">{MOCK_COURSE.title}</h1>
          <p className="lsn-hero__instructor">
            by {MOCK_COURSE.instructor.firstName} {MOCK_COURSE.instructor.lastName}
          </p>
          <div className="lsn-hero__meta">
            <span>📚 {MOCK_COURSE.totalLessons} lessons</span>
            <span>⏱ {fmtTotal(MOCK_COURSE.totalDuration)} total</span>
            <span>✓ {completedCount} completed</span>
          </div>
        </div>

        {/* Progress ring */}
        <div className="lsn-hero__right">
          <div className="lsn-progress-ring-wrap">
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(progressPct / 100) * 201} 201`}
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className="lsn-ring-label">
              <span className="lsn-ring-pct">{progressPct}%</span>
              <span className="lsn-ring-sub">done</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lesson list ── */}
      <div className="lsn-list-wrap">
        <div className="lsn-list-header">
          <h2 className="lsn-list-header__title">Course Lessons</h2>
          <span className="lsn-list-header__count">
            {completedCount} / {MOCK_LESSONS.length} completed
          </span>
        </div>

        <div className="lsn-list">
          {MOCK_LESSONS.map((lesson) => {
            const done    = COMPLETED.has(lesson.id);
            const isOpen  = activeLesson === lesson.id;

            return (
              <div
                key={lesson.id}
                className={`lsn-item ${done ? "lsn-item--done" : ""} ${isOpen ? "lsn-item--open" : ""}`}
              >
                <div
                  className="lsn-item__row"
                  onClick={() => setActiveLesson(isOpen ? null : lesson.id)}
                >
                  {/* Order / status circle */}
                  <div className={`lsn-item__circle ${done ? "lsn-item__circle--done" : ""}`}>
                    {done ? "✓" : lesson.lessonOrder}
                  </div>

                  {/* Thumbnail */}
                  <div className="lsn-item__thumb">
                    <img src={lesson.thumbnailUrl} alt={lesson.title} loading="lazy" />
                    <span className="lsn-item__thumb-play">▶</span>
                  </div>

                  {/* Info */}
                  <div className="lsn-item__info">
                    <div className="lsn-item__top">
                      <h3 className="lsn-item__title">{lesson.title}</h3>
                      <div className="lsn-item__tags">
                        {lesson.preview && <span className="lsn-tag lsn-tag--preview">Free Preview</span>}
                        {lesson.quizzes.length > 0 && (
                          <span className="lsn-tag lsn-tag--quiz">Quiz</span>
                        )}
                      </div>
                    </div>
                    <div className="lsn-item__meta">
                      <span>⏱ {fmtDuration(lesson.duration)}</span>
                      {lesson.quizzes.length > 0 && (
                        <span>📝 {lesson.quizzes.length} quiz</span>
                      )}
                    </div>
                  </div>

                  {/* Expand chevron */}
                  <span className={`lsn-chevron ${isOpen ? "lsn-chevron--open" : ""}`}>›</span>
                </div>

                {/* Expanded description */}
                {isOpen && (
                  <div className="lsn-item__desc">
                    <p>{lesson.description}</p>
                    <div className="lsn-item__actions">
                      <a href={`/student/player?lesson=${lesson.id}`} className="lsn-btn-watch">
                        {done ? "▶ Rewatch" : "▶ Watch Lesson"}
                      </a>
                      {lesson.quizzes.map((q) => (
                        <a key={q.id} href={`/student/quiz?quiz=${q.id}`} className="lsn-btn-quiz">
                          📝 {q.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}