package com.lms.lms.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "questions")

public class Question {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;
    
    @ManyToOne
    @JoinColumn(name = "course_exam_id")
    private CourseExam courseExam;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;
    
    @Enumerated(EnumType.STRING)
    private QuestionType questionType = QuestionType.MCQ;
    
    @SuppressWarnings("unused")
    private Integer questionOrder;
    @SuppressWarnings("unused")
    private Integer points = 1;
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Answer> answers;
    
    public enum QuestionType { MCQ, TRUE_FALSE, SHORT_ANSWER, ESSAY }
}