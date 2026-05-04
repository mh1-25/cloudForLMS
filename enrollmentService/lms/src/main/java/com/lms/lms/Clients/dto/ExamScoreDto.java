package com.lms.lms.Clients.dto;

import java.math.BigDecimal;

public record ExamScoreDto(
        Long attemptId,
        Integer attemptNumber,
        BigDecimal score,
        BigDecimal passingScore,
        boolean passed
) {}
