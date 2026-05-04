package com.lms.lms.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Data @NoArgsConstructor @AllArgsConstructor
public class Certificate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
    
    @Column(name = "certificate_code", unique = true)
    private String certificateCode;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal finalScore;
    
    @Column(name = "issued_at")
    private LocalDateTime issuedAt = LocalDateTime.now();
    
    private boolean valid = true;
}