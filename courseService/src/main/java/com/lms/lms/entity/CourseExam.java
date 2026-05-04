package com.lms.lms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "course_exams")
@Data @NoArgsConstructor @AllArgsConstructor
public class CourseExam {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "course_id")
    private Course course;
    
    private String title = "Final Exam";
    
    private Integer timeLimit = 90;
    
    @Column(name = "total_questions")
    private Integer totalQuestions = 30;
    
     @Column(precision = 4, scale = 2)
    private BigDecimal passingScore = new BigDecimal("70.00");
    
    private Integer maxAttempts = 2;
    
    @OneToMany(mappedBy = "courseExam")
    private List<Question> questions;
}