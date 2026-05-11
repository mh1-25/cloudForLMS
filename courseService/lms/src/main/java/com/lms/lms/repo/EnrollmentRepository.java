package com.lms.lms.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.lms.lms.entity.Enrollment;
import com.lms.lms.entity.User;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByStudent(User student);
    @Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId")
    List<Enrollment> findByCourseId(Long courseId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.course.id = :courseId")
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.status = 'ENROLLED'")
    List<Enrollment> findActiveEnrollmentsByStudentId(Long studentId);
}