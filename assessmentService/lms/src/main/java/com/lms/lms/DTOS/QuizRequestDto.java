package com.lms.lms.DTOS;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class QuizRequestDto {
    private String title;
    private Integer timeLimit =20;
    private Integer totalQuestions =5;
    private BigDecimal passingScore;
    private Boolean Published;
    private Long lessonId;
    private Long courseId;
}


