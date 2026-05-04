package com.lms.lms.DTOS;

import java.math.BigDecimal;

// Returned to the student after submitting a quiz or exam
public record AttemptResultResponse(
        Long attemptId,
        String type,          // "QUIZ" or "EXAM"
        BigDecimal score,
        BigDecimal passingScore,
        boolean passed,
        int totalQuestions,
        int correctAnswers
) {}
