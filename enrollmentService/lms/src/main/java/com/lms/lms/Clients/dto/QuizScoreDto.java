package com.lms.lms.Clients.dto;

import java.math.BigDecimal;

public record QuizScoreDto(
        Long attemptId,
        String quizTitle,
        String lessonTitle,
        BigDecimal score,
        BigDecimal passingScore,
        String status
) {}
