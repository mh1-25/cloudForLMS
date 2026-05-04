package com.lms.lms.Services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.lms.lms.DTOS.EnrollmentResponse;
import com.lms.lms.Entity.Course;
import com.lms.lms.Entity.Enrollment;
import com.lms.lms.Entity.User;
import com.lms.lms.Repo.CourseRepository;
import com.lms.lms.Repo.EnrollmentRepository;
import com.lms.lms.Repo.UserRepository;

import lombok.RequiredArgsConstructor;



@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
   private final UserRepository userRepository;
    

       public EnrollmentResponse enrollInCourse(Long courseId) {
        User student = getLoggedInStudent();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.isPublished()) {
            throw new RuntimeException("Course is not available for enrollment");
        }

        Optional<Enrollment> existing = enrollmentRepository
                .findByStudentIdAndCourseId(student.getId(), courseId);
        if (existing.isPresent()) {
            return EnrollmentResponse.fromEntity(existing.get());
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setStatus(Enrollment.Status.ENROLLED);

        return EnrollmentResponse.fromEntity(enrollmentRepository.save(enrollment));
    }

    // View enrolled courses
    public List<EnrollmentResponse> getEnrolledCourses() {
        User student = getLoggedInStudent();

        return enrollmentRepository.findByStudent(student)
                .stream().map(EnrollmentResponse::fromEntity).collect(Collectors.toList());
    }


    
    private  User getLoggedInStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // instructor can view students enrolled in their course
    public List<EnrollmentResponse> getStudentsInCourse(Long courseId) {
        User student = getLoggedInStudent();
        User instructor = getLoggedInInstructor();

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(instructor.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        if(!course.isPublished()) {
            throw new RuntimeException("Course is not published yet");
        }
        if(course.getEnrollments().isEmpty()) {
            throw new RuntimeException("No students enrolled in this course yet");
        }
        return enrollmentRepository.findByCourseId(courseId)
            .stream()
            .map(EnrollmentResponse::fromEntity)
            .collect(Collectors.toList());
    }
    private User getLoggedInInstructor() {
    var auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated()) {
        throw new RuntimeException("User not authenticated");
    }

    
    boolean isInstructor = auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_INSTRUCTOR"));

    if (!isInstructor) {
        throw new RuntimeException("Access denied: Not an instructor");
    }

    String email = auth.getName();

    return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Instructor not found"));
}
}
