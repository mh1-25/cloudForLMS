package com.lms.lms.DTOS;

import java.math.BigDecimal;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ExamRequestDto {
    private String title;
    private Integer timeLimit = 90;
    private Integer totalQuestions = 30;
    private BigDecimal passingScore;
    private Long courseId;
    private Long instructorId;

}
