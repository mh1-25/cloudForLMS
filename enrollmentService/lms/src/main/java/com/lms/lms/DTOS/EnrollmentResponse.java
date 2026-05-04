package com.lms.lms.DTOS;

import com.lms.lms.Entity.Enrollment;
import com.lms.lms.Entity.User;

import java.time.LocalDateTime;

public record EnrollmentResponse(
        Long enrollmentId,
        Long studentId,
        StudentResponse student,
        Long courseId,
        String courseTitle,
        String status,
        LocalDateTime enrolledAt
) {
    public static EnrollmentResponse fromEntity(Enrollment enrollment) {
        return new EnrollmentResponse(
                enrollment.getId(),
                enrollment.getStudentId(),
                StudentResponse.fromEntity(enrollment.getStudent()),
                enrollment.getCourseId(),
                enrollment.getCourse().getTitle(),
                enrollment.getStatus().name(),
                enrollment.getEnrolledAt()
        );
    }
}