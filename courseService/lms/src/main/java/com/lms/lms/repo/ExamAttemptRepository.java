package com.lms.lms.repo;

import com.lms.lms.entity.ExamAttempt;
import com.lms.lms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {
    List<ExamAttempt> findByStudentAndCourseIdOrderByAttemptNumberDesc(User student, Long courseId);
    

    List<ExamAttempt> findByCourseIdAndPassedTrue(Long courseId);
}