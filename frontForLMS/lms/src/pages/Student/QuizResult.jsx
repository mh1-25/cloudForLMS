import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config/url";
function formatTime(seconds = 0) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function CircleScore({ score, passed }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <svg className="score-ring" viewBox="0 0 120 120" width="120" height="120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={r} fill="none"
        stroke={passed ? "var(--gold)" : "var(--error)"}
        strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="55" textAnchor="middle" className="score-ring__pct">{score}%</text>
      <text x="60" y="76" textAnchor="middle" className="score-ring__label">
        {passed ? "PASSED" : "FAILED"}
      </text>
    </svg>
  );
}

export default function QuizResult() {
  const token = localStorage.getItem("token");

  const stored = useMemo(() => {
    const raw = localStorage.getItem("lms_quiz_result");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(true);

  useEffect(() => {
    if (!stored) return;

    const fetchQuestions = async () => {
      try {
        const url = stored.isFinalExam
          ? `${BASE_URL}api/quizzes-exams/courses/${stored.courseId}/exam`
          : `${BASE_URL}api/quizzes/courses/${stored.courseId}/lessons/${stored.lessonId}/quiz`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setQuestions(stored.questions || []);
      } finally {
        setLoadingQ(false);
      }
    };

    fetchQuestions();
  }, [stored, token]);

  if (!stored) return <p>No result found</p>;

  const passed = stored.passed ?? (stored.score >= (stored.passingScore || 0));

  return (
    <div className="quiz-page">
      {/* Header */}
      <div className="quiz-topbar">
        <div className="quiz-topbar__info">
          <span className="quiz-topbar__lesson">
            {stored.isFinalExam ? "Final Exam" : "Quiz"} Complete
          </span>
          <h1 className="quiz-topbar__title">{stored.quizTitle}</h1>
        </div>
        <button
          className="player-back-btn"
          style={{ marginRight: 16 }}
          onClick={() => window.history.back()}
        >
          ← Back
        </button>
      </div>

      <div className="quiz-body quiz-body--result">
        {/* ── Left: Question Breakdown ── */}
  

        {/* ── Right: Score sidebar ── */}
        <aside className="quiz-sidebar">
          <div className="quiz-sidebar__card result-score-card">
            <CircleScore score={stored.score} passed={passed} />
            <p className="result-score-card__msg">
              {passed
                ? "Great job! You passed."
                : `You need ${stored.passingScore}% to pass.`}
            </p>
          </div>

          <div className="quiz-sidebar__card quiz-sidebar__stats">
            <div className="quiz-stat">
              <span className="quiz-stat__val quiz-stat__val--correct">{stored.correct}</span>
              <span className="quiz-stat__label">Correct</span>
            </div>
            <div className="quiz-stat">
              <span className="quiz-stat__val quiz-stat__val--wrong">
                {stored.total - stored.correct}
              </span>
              <span className="quiz-stat__label">Incorrect</span>
            </div>
            <div className="quiz-stat">
              <span className="quiz-stat__val">{formatTime(stored.timeTaken || 0)}</span>
              <span className="quiz-stat__label">Time taken</span>
            </div>
          </div>

          <div className="quiz-sidebar__card quiz-pass-info">
            <span className="quiz-pass-info__label">Passing score</span>
            <span className="quiz-pass-info__val">{stored.passingScore}%</span>
          </div>

          {/* زر رجوع للكورس */}
          <button
            className="quiz-submit-all"
            style={{ background: "#1d4ed8", marginTop: 12 }}
            onClick={() => {
              localStorage.removeItem("lms_quiz_result");
              window.history.back();
            }}
          >
            ← Back to Course
          </button>
        </aside>
      </div>
    </div>
  );
}