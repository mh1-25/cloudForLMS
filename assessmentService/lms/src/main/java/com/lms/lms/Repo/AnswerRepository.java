package com.lms.lms.Repo;

import com.lms.lms.Entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionIdOrderByAnswerOrder(Long questionId);
    List<Answer> findByQuestionIdAndCorrectTrue(Long questionId);
}