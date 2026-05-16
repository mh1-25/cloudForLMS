import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../config/url";
const LEVEL_META = {
  BEGINNER: { label: "Beginner", bg: "#dcfce7", color: "#15803d" },
  INTERMEDIATE: { label: "Intermediate", bg: "#fef3c7", color: "#92400e" },
  ADVANCED: { label: "Advanced", bg: "#fee2e2", color: "#991b1b" },
};

function fmtDuration(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

export default function CourseDetails() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}api/courses/${courseId}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCourse(res.data);
      } catch (err) {
        console.log("Error fetching course:", err);
      }
    };

    fetchCourse();
  }, [courseId, token]);


  const handleEnroll = async () => {
    try {
      setLoadingEnroll(true);

      const res = await axios.post(
        `${BASE_URL}api/enrollments/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Enrollment success:", res.data);

      setIsEnrolled(true);

      window.location.href = `/student/player?course=${courseId}`;
    } catch (err) {
      console.log("Enrollment error:", err);
    } finally {
      setLoadingEnroll(false);
    }
  };


  const handleCTA = () => {
    if (isEnrolled) {
      window.location.href = `/student/player?course=${course.id}`;
      return;
    }

    handleEnroll();
  };

  if (!course) return <p>Loading...</p>;

  const lvl = LEVEL_META[course.level] || LEVEL_META.BEGINNER;

  return (
    <div className="cd-page">
      <div className="cd-hero">
        <div className="cd-hero__content">
          <div className="cd-hero__badges">
            <span className="cd-cat-badge">{course.categoryName}</span>

            <span
              className="cd-level-badge"
              style={{
                background: lvl.bg,
                color: lvl.color,
              }}
            >
              {lvl.label}
            </span>

            {course.free && (
              <span className="cd-free-badge">Free</span>
            )}
          </div>

          <h1 className="cd-hero__title">{course.title}</h1>

          <p className="cd-hero__desc">
            {course.description}
          </p>

          <p className="cd-hero__inst-line">
            Created by{" "}
            <span className="cd-hero__inst-name">
              {course.instructorName}
            </span>
          </p>
        </div>
      </div>

      <div className="cd-body">
        <div className="cd-body__main">
          <section className="cd-section-block">
            <h2 className="cd-section-block__title">
              Course Curriculum
            </h2>

            <div className="cd-curriculum">
              {course.lessons?.map((lesson) => (
                <div
                  key={lesson.id}
                  className="cd-lesson-row"
                >
                  <span className="cd-lesson-row__title">
                    {lesson.title}
                  </span>

                  <span className="cd-lesson-row__dur">
                    {lesson.duration} min
                  </span>

                  {lesson.preview && (
                    <span className="cd-lesson-row__preview">
                      Preview
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="cd-sticky-sidebar">
          <div className="cd-sticky-sidebar__inner">
            {course.free ? (
              <p className="cd-sidebar-price cd-price--free">
                Free
              </p>
            ) : (
              <p className="cd-sidebar-price">
                ${course.price}
              </p>
            )}

            <button
              className="cd-cta-btn cd-cta-btn--sidebar"
              onClick={handleCTA}
              disabled={loadingEnroll}
            >
              {loadingEnroll
                ? "Processing..."
                : isEnrolled
                ? "Go to Course"
                : course.free
                ? "Enroll Free"
                : "Enroll Now"}
            </button>

            {!isEnrolled && !course.free && (
              <p className="cd-cta-sub cd-cta-sub--sm">
                30-day money-back guarantee
              </p>
            )}

            <div className="cd-sidebar-stats">
              <div className="cd-sidebar-stat">
                <span className="cd-sidebar-stat__val">
                  {course.totalLessons}
                </span>
                <span className="cd-sidebar-stat__label">
                  Lessons
                </span>
              </div>

              <div className="cd-sidebar-stat">
                <span className="cd-sidebar-stat__val">
                  {fmtDuration(course.totalDuration)}
                </span>
                <span className="cd-sidebar-stat__label">
                  Duration
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}