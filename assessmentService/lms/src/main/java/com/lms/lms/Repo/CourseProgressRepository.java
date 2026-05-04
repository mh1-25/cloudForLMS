package com.lms.lms.Repo;

import com.lms.lms.Entity.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {

    Optional<CourseProgress> findByEnrollmentStudentIdAndEnrollmentCourseIdAndLessonId(
            Long studentId, Long courseId, Long lessonId);

    List<CourseProgress> findByEnrollmentStudentIdAndEnrollmentCourseId(
            Long studentId, Long courseId);
}
