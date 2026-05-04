package com.lms.lms.Repo;

import com.lms.lms.Entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    // Lesson Quiz Questions
    List<Question> findByQuizLessonIdOrderByQuestionOrder(Long lessonId);
    
    // Final Exam Questions
    List<Question> findByCourseExamCourseIdOrderByQuestionOrder(Long courseId);
    List<Question> findByCourseExamIdOrderByQuestionOrder(Long examId);
    List<Question> findByQuizIdOrderByQuestionOrder(Long quizId);
    @Query(value = "SELECT * FROM questions WHERE quiz_id = ?1 ORDER BY RANDOM() ", nativeQuery = true)
    List<Question> findRandomQuestionsByQuizId(Long quizId, int limit);
}