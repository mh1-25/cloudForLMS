package com.lms.lms.Repo;

import com.lms.lms.Entity.ExamAttempt;
import com.lms.lms.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamAttemptRepository extends JpaRepository<ExamAttempt, Long> {
    List<ExamAttempt> findByStudentAndCourseIdOrderByAttemptNumberDesc(User student, Long courseId);
}
