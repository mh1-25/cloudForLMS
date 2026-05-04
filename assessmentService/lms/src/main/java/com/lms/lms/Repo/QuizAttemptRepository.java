package com.lms.lms.Repo;

import com.lms.lms.Entity.QuizAttempt;
import com.lms.lms.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByStudentAndQuizLessonIdOrderBySubmittedAtDesc(User student, Long lessonId);

    @Query("""
            SELECT AVG(qa.score) FROM QuizAttempt qa
            WHERE qa.student.id = :studentId
              AND qa.quiz.lesson.course.id = :courseId
            """)
    Double getAverageQuizScoreByStudentAndCourse(@Param("studentId") Long studentId,
                                                 @Param("courseId") Long courseId);
}
