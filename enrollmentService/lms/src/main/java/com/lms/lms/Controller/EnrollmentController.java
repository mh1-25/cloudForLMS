package com.lms.lms.Controller;

import com.lms.lms.DTOS.EnrollmentResponse;

import com.lms.lms.Services.EnrollmentService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

   
    @PostMapping("/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(
            @PathVariable Long courseId) {

        EnrollmentResponse response =
                enrollmentService.enrollInCourse(courseId);

        return ResponseEntity.ok(response);
    }
  
   
    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EnrollmentResponse>> getMyCourses() {

        return ResponseEntity.ok(
                enrollmentService.getEnrolledCourses()
        );
    }
    @GetMapping("/EnrolledStudents/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<List<EnrollmentResponse>> GetStudentInCourse(@PathVariable Long courseId) 
    {
        return ResponseEntity.ok(
                enrollmentService.getStudentsInCourse(courseId)
        );
    }
    
}