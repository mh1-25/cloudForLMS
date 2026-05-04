package com.lms.lms.repo;

import com.lms.lms.entity.QuizAttempt;
import com.lms.lms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByStudentAndQuizLessonIdOrderBySubmittedAtDesc(User student, Long lessonId);
    
    @Query("SELECT AVG(qa.score) FROM QuizAttempt qa " +
           "WHERE qa.student.id = ?1 AND qa.quiz.lesson.course.id = ?2")
    Double getAverageQuizScoreByStudentAndCourse(Long studentId, Long courseId);
}