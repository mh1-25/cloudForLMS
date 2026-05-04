package com.lms.lms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_attempts")
@Data @NoArgsConstructor @AllArgsConstructor
public class ExamAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "course_exam_id")
    private CourseExam courseExam;
    
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal score;
    
    private boolean passed;
    
    @Column(name = "attempt_number")
    private Integer attemptNumber = 1;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt = LocalDateTime.now();
}