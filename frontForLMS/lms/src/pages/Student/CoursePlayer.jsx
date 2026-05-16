import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../config/url";

function fmtDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const TABS = ["Overview", "Resources", "Q&A", "Notes"];

export default function CoursePlayer() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("course");

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [notes, setNotes] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}api/courses/${courseId}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const courseData = res.data;
        console.log(res.data);

        setCourse(courseData);
        setLessons(courseData.lessons || []);

        if (courseData.lessons?.length > 0) {
          setCurrentId(courseData.lessons[0].id);
        }
      } catch (error) {
        console.log("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseId, token]);

  const current = lessons.find((lesson) => lesson.id === currentId);

  const completedCount = 0;
  const progressPct =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  const goNext = () => {
    const currentIndex = lessons.findIndex(
      (lesson) => lesson.id === currentId
    );
    if (currentIndex < lessons.length - 1) {
      setCurrentId(lessons[currentIndex + 1].id);
    }
  };

  const goPrev = () => {
    const currentIndex = lessons.findIndex(
      (lesson) => lesson.id === currentId
    );
    if (currentIndex > 0) {
      setCurrentId(lessons[currentIndex - 1].id);
    }
  };

  const handleQuizNavigation = () => {
    if (!current?.id) return;
    window.location.href = `/student/quiz?courseId=${courseId}&lessonId=${current.id}`;
  };

  // ✅ زر الـ Final Exam — بيوديك لنفس صفحة الكويز بس بدون lessonId
  const handleExamNavigation = () => {
    if (!courseId) return;
    window.location.href = `/student/quiz?courseId=${courseId}`;
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="player-page">
      {/* ── Top bar ── */}
      <div className="player-topbar">
        <div className="player-topbar__left">
          <button
            className="player-back-btn"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>

          <div>
            <p className="player-topbar__course">{course.title}</p>
            <p className="player-topbar__lesson">{current?.title}</p>
          </div>
        </div>

        <div className="player-topbar__right">
          <button
            className="player-sidebar-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            title="Toggle curriculum"
          >
            {sidebarOpen ? "✕ Hide" : "≡ Curriculum"}
          </button>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className={`player-body ${sidebarOpen ? "" : "player-body--full"}`}>
        {/* ── Video + content ── */}
        <div className="player-main">
          {/* Video area */}
          <div className="player-video-wrap">
            {current?.video_url ? (
              <iframe
                src={current.video_url}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
                className="player-iframe"
              />
            ) : (
              <div className="player-video-placeholder">
                <span className="player-video-placeholder__icon">🎬</span>
                <p>Video not available yet</p>
              </div>
            )}
          </div>

          {/* Video controls bar */}
          <div className="player-controls">
            <div className="player-controls__left">
              <button
                className="player-ctrl-btn"
                onClick={goPrev}
                disabled={currentId === lessons[0]?.id}
              >
                ← Prev
              </button>

              <button
                className="player-ctrl-btn player-ctrl-btn--next"
                onClick={goNext}
                disabled={currentId === lessons[lessons.length - 1]?.id}
              >
                Next →
              </button>
            </div>

            {/* ✅ الزرين جنب بعض — Take Quiz و Final Exam */}
            <div className="player-controls__right">
              <button className="player-quiz-btn" onClick={handleQuizNavigation}>
                📝 Take Quiz
              </button>

              <button className="player-quiz-btn" onClick={handleExamNavigation}>
                🎓 Final Exam
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="player-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`player-tab ${activeTab === tab ? "player-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="player-tab-content">
            {activeTab === "Overview" && (
              <div className="player-overview">
                <h2 className="player-overview__title">{current?.title}</h2>

                <p className="player-overview__meta">
                  ⏱ {fmtDuration(current?.duration || 0)}
                  &nbsp;·&nbsp;
                  Lesson {current?.lessonOrder} of {lessons.length}
                  &nbsp;·&nbsp;
                  {current?.preview ? "Free Preview" : "Enrolled"}
                </p>

                <p className="player-overview__desc">
                  {current?.description || "No description available"}
                </p>
              </div>
            )}

            {activeTab === "Resources" && (
              <div className="player-resources">
                <p>No resources available</p>
              </div>
            )}

            {activeTab === "Q&A" && (
              <div className="player-qa">
                <p className="player-qa__empty">
                  No questions yet. Be the first to ask!
                </p>
                <button className="player-qa__ask">Ask a Question</button>
              </div>
            )}

            {activeTab === "Notes" && (
              <div className="player-notes">
                <textarea
                  className="player-notes__area"
                  placeholder="Write your notes for this lesson…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={8}
                />
                <button
                  className="player-notes__save"
                  onClick={() => alert("Notes saved!")}
                >
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Curriculum sidebar ── */}
        {sidebarOpen && (
          <aside className="player-sidebar">
            <div className="player-sidebar__header">
              <span>Curriculum</span>
            </div>

            <div className="player-sidebar__list">
              {lessons.map((lesson) => {
                const active = lesson.id === currentId;

                return (
                  <button
                    key={lesson.id}
                    className={`player-sidebar__item ${active ? "player-sidebar__item--active" : ""}`}
                    onClick={() => setCurrentId(lesson.id)}
                  >
                    <span className="player-sidebar__dot">
                      {lesson.lessonOrder}
                    </span>

                    <span className="player-sidebar__item-info">
                      <span className="player-sidebar__item-title">
                        {lesson.title}
                      </span>
                      <span className="player-sidebar__item-dur">
                        {fmtDuration(lesson.duration)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}