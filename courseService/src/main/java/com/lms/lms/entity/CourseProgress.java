package com.lms.lms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_progress")
@Data @NoArgsConstructor @AllArgsConstructor
public class CourseProgress {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;
    
    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
    
    private boolean completed = false;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
   @Column(name = "progress_percentage", precision = 5, scale = 2)
    private BigDecimal progressPercentage = BigDecimal.ZERO;
}