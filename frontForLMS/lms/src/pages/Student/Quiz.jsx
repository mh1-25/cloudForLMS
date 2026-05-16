import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../config/url";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const s = (seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${m}:${s}`;
}

export default function Quiz({ onSubmit }) {
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("courseId");
  const lessonId = searchParams.get("lessonId");

  // if lessonId exists => lesson quiz
  // if no lessonId => final exam
  const isFinalExam = !lessonId;

  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");


  useEffect(() => {
    if (!courseId) return;

    const fetchQuizData = async () => {
      try {
        let url = "";

        if (isFinalExam) {
         url = `${BASE_URL}api/quizzes-exams/courses/${courseId}/exam`;;
         
        } else {
          url = `${BASE_URL}api/quizzes/courses/${courseId}/lessons/${lessonId}/quiz`;
        }
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);
        
        setQuiz(res.data);

        const totalSeconds = (res.data.timeLimit || 10) * 60;
        setTimeLeft(totalSeconds);
      } catch (error) {
        console.log("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [courseId, lessonId, isFinalExam, token]);


  useEffect(() => {
    if (!quiz || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, submitted]);


 const submitUrl = isFinalExam
  ? `${BASE_URL}api/quizzes-exams/courses/${courseId}/exam/submit`
  : `${BASE_URL}api/quizzes/courses/${courseId}/quiz/submit`;

const handleSubmit = useCallback(async () => {
  if (!quiz) return;

  try {
    setSubmitted(true);

    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedAnswerId]) => ({
        questionId: Number(questionId),
        selectedAnswerId: Number(selectedAnswerId),
      })
    );

    const body = isFinalExam
      ? {
          courseId,
          answers: formattedAnswers,
        }
      : {
          quizId: quiz.id,
          answers: formattedAnswers,
        };

    const res = await axios.post(submitUrl, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

localStorage.setItem("lms_quiz_result", JSON.stringify({
  quizTitle: quiz.title,
  score: res.data.score,
  passed: res.data.passed,
  total: res.data.totalQuestions,
  correct: res.data.correctAnswers,
  type: res.data.type,
  questions: quiz.questions || [],
  answers,
  passingScore: quiz.passingScore,      
  isFinalExam,                         
  courseId,                           
  lessonId: lessonId || null,          
}));
    window.location.href = "/student/results";
  } catch (error) {
    console.log(error);
  }
}, [answers, quiz, isFinalExam]);
  const toggleFlag = () => {
    if (!quiz?.questions?.length) return;
    const currentQuestion = quiz.questions[current];

    setFlagged((prev) => {
      const next = new Set(prev);

      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }

      return next;
    });
  };

  if (loading) return <p>Loading...</p>;
  if (!quiz) return <p>Quiz not found</p>;

  const total = quiz.questions.length || 0 ;

  if (!total || current >= total) {
    return <p>No questions available</p>;
  }

  const q = quiz.questions[current];
  const answered = Object.keys(answers).length;
  const progress = ((current + 1) / total) * 100;
  const timerWarning = timeLeft <= 60;

  return (
    <div className="quiz-page">
      {/* ── Top bar ── */}
      <div className="quiz-topbar">
        <div className="quiz-topbar__info">
          <span className="quiz-topbar__lesson">
            {isFinalExam ? "Final Exam" : "Lesson Quiz"}
          </span>

          <h1 className="quiz-topbar__title">
            {quiz.title}
          </h1>
        </div>

        <div
          className={`quiz-timer${timerWarning ? " quiz-timer--warn" : ""
            }`}
        >
          <span className="quiz-timer__icon">
            {timerWarning ? "⚠" : "⏱"}
          </span>

          <span className="quiz-timer__value">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="quiz-progress-bar">
        <div
          className="quiz-progress-bar__fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="quiz-body">
        <div className="quiz-panel">
          <div className="quiz-panel__header">
            <span className="quiz-q-counter">
              Question {current + 1}
              <span> / {total}</span>
            </span>

            <button
              className={`quiz-flag-btn${flagged.has(q.id) ? " flagged" : ""
                }`}
              onClick={toggleFlag}
            >
              {flagged.has(q.id)
                ? "Flagged"
                : " Flag"}
            </button>
          </div>

          <p className="quiz-question-text">
            {q.questionText}
          </p>

          <div className="quiz-options">
            {q.answers?.map((answer) => {
              const selected =
                answers[q.id] === answer.id;

              return (
                <button
                  key={answer.id}
                  className={`quiz-option${selected
                    ? " quiz-option--selected"
                    : ""
                    }`}
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      [q.id]: answer.id,
                    }))
                  }
                >
                  <span className="quiz-option__dot" />
                  <span className="quiz-option__text">
                    {answer.answerText}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="quiz-nav">
            <button
              className="quiz-nav__btn quiz-nav__btn--ghost"
              onClick={() =>
                setCurrent((prev) =>
                  Math.max(0, prev - 1)
                )
              }
              disabled={current === 0}
            >
              ← Previous
            </button>

            {current < total - 1 ? (
              <button
                className="quiz-nav__btn quiz-nav__btn--primary"
                onClick={() =>
                  setCurrent((prev) => prev + 1)
                }
              >
                Next →
              </button>
            ) : (
              <button
                className="quiz-nav__btn quiz-nav__btn--submit"
                onClick={handleSubmit}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>

        <aside className="quiz-sidebar">
          <div className="quiz-sidebar__card">
            <p className="quiz-sidebar__heading">
              Question Map
            </p>

            <div className="quiz-dot-grid">
              {quiz.questions.map((question, i) => {
                const isAnswered =
                  !!answers[question.id];

                const isCurrent = i === current;

                const isFlagged =
                  flagged.has(question.id);

                return (
                  <button
                    key={question.id}
                    className={`quiz-dot
                      ${isCurrent
                        ? " quiz-dot--current"
                        : ""
                      }
                      ${isAnswered
                        ? " quiz-dot--answered"
                        : ""
                      }
                      ${isFlagged
                        ? " quiz-dot--flagged"
                        : ""
                      }
                    `}
                    onClick={() => setCurrent(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="quiz-legend">
              <span>
                <span className="legend-dot legend-dot--answered" />
                Answered
              </span>

              <span>
                <span className="legend-dot legend-dot--unanswered" />
                Unanswered
              </span>

              <span>
                <span className="legend-dot legend-dot--flagged" />
                Flagged
              </span>
            </div>
          </div>

          <div className="quiz-sidebar__card quiz-sidebar__stats">
            <div className="quiz-stat">
              <span className="quiz-stat__val">
                {answered}
              </span>
              <span className="quiz-stat__label">
                Answered
              </span>
            </div>

            <div className="quiz-stat">
              <span className="quiz-stat__val">
                {total - answered}
              </span>
              <span className="quiz-stat__label">
                Remaining
              </span>
            </div>

            <div className="quiz-stat">
              <span className="quiz-stat__val">
                {flagged.size}
              </span>
              <span className="quiz-stat__label">
                Flagged
              </span>
            </div>
          </div>

          <div className="quiz-sidebar__card quiz-pass-info">
            <span className="quiz-pass-info__label">
              Passing score
            </span>

            <span className="quiz-pass-info__val">
              {quiz.passingScore}%
            </span>
          </div>

          <button
            className="quiz-submit-all"
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
        </aside>
      </div>
    </div>
  );
}