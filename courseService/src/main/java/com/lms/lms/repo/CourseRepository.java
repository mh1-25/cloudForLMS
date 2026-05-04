package com.lms.lms.repo;

import com.lms.lms.entity.Course;
import com.lms.lms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Instructor courses
    List<Course> findByInstructorAndPublishedTrueOrderByCreatedAtDesc(User instructor);

    // Search
    List<Course> findByTitleContainingIgnoreCaseAndPublishedTrue(String title);

    // Category filter
    List<Course> findByCategory_IdAndPublishedTrue(Long categoryId);

    // Free courses
    List<Course> findByFreeTrueAndPublishedTrue();

    List<Course> findByInstructor(Long instructor);
}