package com.lms.lms.repo;

import com.lms.lms.entity.Enrollment;
import com.lms.lms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByStudent(User student);
    @Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId")
    List<Enrollment> findByCourseId(Long courseId);
    
    // ✅ الـ Query المهم
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.course.id = :courseId")
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.status = 'ENROLLED'")
    List<Enrollment> findActiveEnrollmentsByStudentId(Long studentId);
}