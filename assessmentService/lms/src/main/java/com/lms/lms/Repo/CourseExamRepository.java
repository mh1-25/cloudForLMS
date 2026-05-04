package com.lms.lms.Repo;

import com.lms.lms.Entity.CourseExam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CourseExamRepository extends JpaRepository<CourseExam, Long> {
    Optional<CourseExam> findByCourseId(Long courseId);
}