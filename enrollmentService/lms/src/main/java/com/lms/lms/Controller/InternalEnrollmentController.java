package com.lms.lms.Controller;

import com.lms.lms.DTOS.EnrollmentResponse;
import com.lms.lms.Repo.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/internal/enrollments")
@RequiredArgsConstructor
public class InternalEnrollmentController {

    private final EnrollmentRepository enrollmentRepository;

    @GetMapping("/exists")
    public boolean exists(@RequestParam Long studentId, @RequestParam Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId).isPresent();
    }

    @GetMapping("/by-student-course")
    public ResponseEntity<EnrollmentResponse> getByStudentCourse(@RequestParam Long studentId,
                                                                  @RequestParam Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .map(EnrollmentResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
