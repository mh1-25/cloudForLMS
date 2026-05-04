package com.lms.lms.entity;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

import java.util.List;

@Entity
@Data
@Table(name = "quizzes")
public class Quiz {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
    
    @Column(nullable = false)
    private String title;
    
    @SuppressWarnings("unused")
    private Integer timeLimit = 20;
    
    @Column(name = "total_questions")
    private Integer totalQuestions = 5;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal passingScore = new BigDecimal("70.00");
    
    @Column(name = "is_published")
    private boolean published = false;
    
    @OneToMany(mappedBy = "quiz")
    private List<Question> questions;
};

