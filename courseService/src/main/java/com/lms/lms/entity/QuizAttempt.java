package com.lms.lms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_attempts")
@Data @NoArgsConstructor @AllArgsConstructor
public class QuizAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt = LocalDateTime.now();
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal score;
    
    @Enumerated(EnumType.STRING)
    private Status status = Status.IN_PROGRESS;
    
    public enum Status { IN_PROGRESS, SUBMITTED, PASSED, FAILED }
}
