package com.lms.lms.DTOS;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class QuizResponseDto {
    private Long id;
    private String title;
    private Integer timeLimit;
    private Integer totalQuestions;
    private BigDecimal passingScore;
    private Boolean Published;
    private Long lessonId;
}