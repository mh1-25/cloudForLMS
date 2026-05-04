package com.lms.lms.Repo;

import com.lms.lms.Entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByLessonId(Long lessonId);
    Optional<Quiz> findByLessonIdAndPublishedTrue(Long lessonId);
}